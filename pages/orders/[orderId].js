import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useOrders } from '../../context/order-context';
import { OrderStatusTracker } from '../../components/orders/OrderStatusTracker';
import { useToast } from '../../context/toast-context';

const imageLoader = ({ src }) => {
    if (src && src.startsWith("http")) return src;
    return `/images/products/${src}`;
};

export default function OrderDetailsPage() {
    const router = useRouter();
    const { orderId } = router.query;
    const { getOrder, advanceOrderStatus, cancelOrder } = useOrders();
    const { showToast } = useToast();

    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orderId) {
            const found = getOrder(orderId);
            if (found) {
                setOrder(found);
            }
        }
    }, [orderId, getOrder]);

    const handleAdvanceStage = () => {
        if (!order) return;
        advanceOrderStatus(order.id);
        const updated = getOrder(order.id);
        setOrder({ ...updated });
        showToast(`Tracking updated: "${updated?.status}"!`, "success");
    };

    const handleCancel = () => {
        if (confirm("Are you sure you want to cancel this order?")) {
            cancelOrder(order.id);
            const updated = getOrder(order.id);
            setOrder({ ...updated });
            showToast("Order has been cancelled.", "info");
        }
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    if (!order) {
        return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
                <span className="text-4xl block mb-3">🔍</span>
                <h1 className="text-xl font-bold text-slate-900">Order Not Found</h1>
                <p className="text-xs text-slate-500 mt-1 mb-6">Could not find an order matching #{orderId}.</p>
                <Link href="/orders">
                    <a className="inline-flex px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">
                        Back to Orders
                    </a>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Order #{order.id} - AURA STYLE</title>
            </Head>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Top Nav */}
                <div className="flex items-center justify-between">
                    <Link href="/orders">
                        <a className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition">
                            <span>←</span> Back to All Orders
                        </a>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handlePrintInvoice}
                            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                        >
                            <span>📄 Print Receipt</span>
                        </button>
                    </div>
                </div>

                {/* Order Summary Hero Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Order Reference
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-0.5">
                                #{order.id}
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Placed on {order.formattedDate || new Date(order.date).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                            <span
                                className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                    order.status === 'Delivered'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : order.status === 'Cancelled'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-amber-100 text-amber-800'
                                }`}
                            >
                                ● {order.status}
                            </span>
                        </div>
                    </div>

                    {/* Live Tracker */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900">Shipment Timeline & Tracking</h2>
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <button
                                    type="button"
                                    onClick={handleAdvanceStage}
                                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition border border-indigo-200"
                                >
                                    ⚡ Advance Stage (Demo)
                                </button>
                            )}
                        </div>

                        <OrderStatusTracker
                            timeline={order.trackingTimeline || []}
                            currentStatus={order.status}
                        />
                    </div>
                </div>

                {/* Items & Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Itemized Table */}
                    <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Item Details ({order.items?.length || 0})
                        </h2>

                        <div className="space-y-4 divide-y divide-slate-100">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="pt-3 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-20 bg-slate-50 rounded-2xl p-2 flex items-center justify-center border border-slate-100 flex-shrink-0">
                                            <Image
                                                loader={imageLoader}
                                                src={item.imgUrl}
                                                alt={item.title}
                                                width={60}
                                                height={75}
                                                objectFit="contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase">{item.category}</p>
                                            <Link href={`/product/${item.id}`}>
                                                <a className="text-sm font-bold text-slate-900 hover:underline line-clamp-1">
                                                    {item.title}
                                                </a>
                                            </Link>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Qty: <span className="font-bold text-slate-800">{item.qt || 1}</span> × ₹{item.price}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-sm sm:text-base font-bold text-slate-900">
                                        ₹{(Number(item.price) || 0) * (Number(item.qt) || 1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side Info Cards: Address & Price Breakdown */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                                Delivery Address
                            </h3>
                            <p className="text-sm font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
                            <p className="text-xs text-slate-600 leading-relaxed">{order.shippingAddress?.street}</p>
                            <p className="text-xs text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                            <p className="text-xs text-slate-500 pt-1">📞 {order.shippingAddress?.phone}</p>
                        </div>

                        {/* Payment & Price Summary */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 text-xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                                Payment Details
                            </h3>
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-semibold text-slate-900">₹{order.pricing?.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Tax (10%)</span>
                                <span className="font-semibold text-slate-900">₹{order.pricing?.tax}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Fee</span>
                                <span className="font-semibold text-slate-900">
                                    {order.pricing?.deliveryCharge === 0 ? 'FREE' : `₹${order.pricing?.deliveryCharge}`}
                                </span>
                            </div>
                            {order.pricing?.discount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 p-2 rounded-xl">
                                    <span>Discount</span>
                                    <span>-₹{order.pricing?.discount}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                                <span className="text-sm font-bold text-slate-900">Grand Total</span>
                                <span className="text-xl font-extrabold text-slate-900">₹{order.pricing?.grandTotal}</span>
                            </div>

                            <p className="text-[11px] text-slate-400 pt-2">
                                Method: <span className="text-slate-700 font-medium">{order.paymentMethod?.label}</span>
                            </p>
                        </div>

                        {/* Cancel order button if applicable */}
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl border border-rose-200 transition"
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
