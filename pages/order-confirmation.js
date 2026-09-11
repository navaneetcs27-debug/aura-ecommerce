import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useOrders } from '../context/order-context';
import { OrderStatusTracker } from '../components/orders/OrderStatusTracker';
import { useToast } from '../context/toast-context';

const imageLoader = ({ src }) => {
    if (src && src.startsWith("http")) return src;
    return `/images/products/${src}`;
};

export default function OrderConfirmationPage() {
    const router = useRouter();
    const { orderId } = router.query;
    const { getOrder, advanceOrderStatus, orders } = useOrders();
    const { showToast } = useToast();

    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orderId) {
            const found = getOrder(orderId);
            if (found) {
                setOrder(found);
            }
        } else if (orders.length > 0) {
            // Fallback to most recent order if no query param
            setOrder(orders[0]);
        }
    }, [orderId, orders, getOrder]);

    const handleAdvanceStage = () => {
        if (!order) return;
        advanceOrderStatus(order.id);
        const updated = getOrder(order.id);
        setOrder({ ...updated });
        showToast(`Order status updated to "${updated?.status}"!`, "success");
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    if (!order) {
        return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
                <span className="text-4xl block mb-3">📦</span>
                <h1 className="text-xl font-bold text-slate-900">Loading Order Details...</h1>
                <p className="text-xs text-slate-500 mt-1 mb-6">Retrieving your order summary.</p>
                <Link href="/orders">
                    <a className="inline-flex px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">
                        View All Orders
                    </a>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Order Confirmed #{order.id} - AURA STYLE</title>
            </Head>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Celebratory Hero Card */}
                <div className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200/80 shadow-md text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold animate-bounce shadow-sm">
                        ✓
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                        Payment Successful & Order Placed
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Thank You For Your Order!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                        We have received your order and our team is already preparing it. You will receive tracking updates via SMS & email.
                    </p>

                    <div className="inline-flex flex-wrap items-center justify-center gap-3 pt-2">
                        <span className="px-3.5 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-800 font-mono">
                            Order ID: {order.id}
                        </span>
                        <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">
                            Estimated Delivery: {order.estimatedDelivery}
                        </span>
                    </div>
                </div>

                {/* Live Tracking Timeline Card */}
                <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span>🚚 Live Shipment Tracker</span>
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">Real-time status of your parcel</p>
                        </div>

                        {/* Interactive demo button to simulate progress */}
                        {order.status !== "Delivered" && (
                            <button
                                type="button"
                                onClick={handleAdvanceStage}
                                className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition border border-indigo-200 shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                            >
                                <span>⚡ Simulate Next Stage</span>
                            </button>
                        )}
                    </div>

                    <OrderStatusTracker
                        timeline={order.trackingTimeline || []}
                        currentStatus={order.status}
                    />
                </div>

                {/* Order Details Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items Ordered */}
                    <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                            Items in this Order ({order.items?.length || 0})
                        </h3>
                        <div className="space-y-3 divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="pt-2 flex items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-14 bg-slate-50 rounded-xl p-1 flex items-center justify-center border border-slate-100">
                                            <Image
                                                loader={imageLoader}
                                                src={item.imgUrl}
                                                alt={item.title}
                                                width={45}
                                                height={55}
                                                objectFit="contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                                            <p className="text-[11px] text-slate-400">Qty: {item.qt || 1} × ₹{item.price}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900">
                                        ₹{(Number(item.price) || 0) * (Number(item.qt) || 1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping & Payment Summary */}
                    <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                            Delivery & Payment Summary
                        </h3>
                        <div className="space-y-2.5 text-xs">
                            <div>
                                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Shipping Address</span>
                                <p className="font-bold text-slate-800">{order.shippingAddress?.fullName}</p>
                                <p className="text-slate-600">{order.shippingAddress?.street}</p>
                                <p className="text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</p>
                                <p className="text-slate-500">📞 {order.shippingAddress?.phone}</p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Payment Method</span>
                                    <p className="font-bold text-slate-800">{order.paymentMethod?.label}</p>
                                    {order.paymentMethod?.paymentId && (
                                        <p className="text-[11px] text-indigo-600 font-mono mt-0.5">Ref: {order.paymentMethod.paymentId}</p>
                                    )}
                                </div>
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold uppercase">
                                    ✓ {order.paymentMethod?.type === 'cod' ? 'Pay on Delivery' : 'Paid Online'}
                                </span>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                                <span className="font-bold text-slate-700">Total Paid:</span>
                                <span className="text-lg font-extrabold text-slate-900">₹{order.pricing?.grandTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                    <button
                        type="button"
                        onClick={handlePrintInvoice}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-2"
                    >
                        <span>📄 Print Invoice / Receipt</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <Link href="/orders">
                            <a className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition">
                                View in Order History
                            </a>
                        </Link>
                        <Link href="/search">
                            <a className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-sm">
                                Continue Shopping 🛍️
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
