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
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-neutral-300 text-center shadow-sm">
                <span className="text-4xl block mb-3">🔍</span>
                <h1 className="text-xl font-black text-neutral-950">Order Not Found</h1>
                <p className="text-xs text-neutral-700 font-semibold mt-1 mb-6">Could not find an order matching #{orderId}.</p>
                <Link href="/orders">
                    <a className="inline-flex px-6 py-2.5 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition">
                        Back to Orders
                    </a>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Order #{order.id} - AURA ATELIER</title>
            </Head>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Top Nav */}
                <div className="flex items-center justify-between">
                    <Link href="/orders">
                        <a className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-neutral-950 transition">
                            <span>←</span> Back to All Orders
                        </a>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handlePrintInvoice}
                            className="px-4 py-2 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-950 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                        >
                            <span>📄 Print Receipt</span>
                        </button>
                    </div>
                </div>

                {/* Order Summary Hero Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-300 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                        <div>
                            <span className="text-[11px] font-black text-neutral-700 uppercase tracking-wider">
                                Order Reference
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 font-mono mt-0.5">
                                #{order.id}
                            </h1>
                            <p className="text-xs text-neutral-700 font-bold mt-1">
                                Placed on {order.formattedDate || new Date(order.date).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                            <span
                                className={`px-4 py-1.5 rounded-full text-xs font-black border ${
                                    order.status === 'Delivered'
                                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                        : order.status === 'Cancelled'
                                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                                        : 'bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                            >
                                ● {order.status}
                            </span>
                        </div>
                    </div>

                    {/* Live Tracker */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-neutral-950">Shipment Timeline & Tracking</h2>
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <button
                                    type="button"
                                    onClick={handleAdvanceStage}
                                    className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
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
                    <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-300 shadow-sm space-y-4">
                        <h2 className="text-sm font-black text-neutral-950 border-b border-neutral-200 pb-3">
                            Item Details ({order.items?.length || 0})
                        </h2>

                        <div className="space-y-4 divide-y divide-neutral-100">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="pt-3 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-20 bg-neutral-100 rounded-2xl p-2 flex items-center justify-center border border-neutral-200 flex-shrink-0">
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
                                            <p className="text-xs font-black text-neutral-700 uppercase tracking-wider">{item.category}</p>
                                            <Link href={`/product/${item.id}`}>
                                                <a className="text-sm font-bold text-neutral-950 hover:underline line-clamp-1">
                                                    {item.title}
                                                </a>
                                            </Link>
                                            <p className="text-xs text-neutral-700 font-semibold mt-1">
                                                Qty: <span className="font-black text-neutral-950">{item.qt || 1}</span> × ₹{item.price}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-sm sm:text-base font-black text-neutral-950">
                                        ₹{(Number(item.price) || 0) * (Number(item.qt) || 1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side Info Cards: Address & Price Breakdown */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-3xl p-6 border border-neutral-300 shadow-sm space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-2">
                                Delivery Address
                            </h3>
                            <p className="text-sm font-black text-neutral-950">{order.shippingAddress?.fullName}</p>
                            <p className="text-xs text-neutral-800 font-medium leading-relaxed">{order.shippingAddress?.street}</p>
                            <p className="text-xs text-neutral-800 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                            <p className="text-xs text-neutral-700 font-bold pt-1">📞 {order.shippingAddress?.phone}</p>
                        </div>

                        {/* Payment & Price Summary */}
                        <div className="bg-white rounded-3xl p-6 border border-neutral-300 shadow-sm space-y-3 text-xs">
                            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-2">
                                Payment Details
                            </h3>
                            <div className="flex justify-between text-neutral-800 font-medium">
                                <span>Subtotal</span>
                                <span className="font-bold text-neutral-950">₹{order.pricing?.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-neutral-800 font-medium">
                                <span>Tax (10%)</span>
                                <span className="font-bold text-neutral-950">₹{order.pricing?.tax}</span>
                            </div>
                            <div className="flex justify-between text-neutral-800 font-medium">
                                <span>Delivery Fee</span>
                                <span className="font-bold text-neutral-950">
                                    {order.pricing?.deliveryCharge === 0 ? 'FREE' : `₹${order.pricing?.deliveryCharge}`}
                                </span>
                            </div>
                            {order.pricing?.discount > 0 && (
                                <div className="flex justify-between text-emerald-900 font-bold bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                                    <span>Discount</span>
                                    <span>-₹{order.pricing?.discount}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                                <span className="text-sm font-bold text-neutral-800">Grand Total</span>
                                <span className="text-xl font-black text-neutral-950">₹{order.pricing?.grandTotal}</span>
                            </div>

                            <p className="text-[11px] text-neutral-700 font-semibold pt-2">
                                Method: <span className="text-neutral-950 font-bold">{order.paymentMethod?.label}</span>
                            </p>
                        </div>

                        {/* Cancel order button if applicable */}
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-2xl border border-rose-300 transition"
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
