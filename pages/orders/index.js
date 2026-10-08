import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useOrders } from '../../context/order-context';
import { useCart } from '../../context/cart-context';
import { useToast } from '../../context/toast-context';

const imageLoader = ({ src }) => {
    if (src && src.startsWith("http")) return src;
    return `/images/products/${src}`;
};

export default function OrdersPage() {
    const router = useRouter();
    const { orders, cancelOrder } = useOrders();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = (orders || []).filter((order) => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'active') return order.status !== 'Delivered' && order.status !== 'Cancelled';
        if (statusFilter === 'delivered') return order.status === 'Delivered';
        if (statusFilter === 'cancelled') return order.status === 'Cancelled';
        return true;
    });

    const handleReorder = (order) => {
        if (!order || !order.items) return;
        order.items.forEach((item) => {
            addToCart(item, item.qt || 1);
        });
        showToast("Items added back to your cart! 🛒", "success");
        router.push('/cart');
    };

    const handleCancelOrder = (orderId) => {
        if (confirm("Are you sure you want to cancel this order?")) {
            cancelOrder(orderId);
            showToast(`Order #${orderId} has been cancelled.`, "info");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
            case 'Shipped':
            case 'Out for Delivery':
                return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
            case 'Processing':
            case 'Order Placed':
                return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
            case 'Cancelled':
                return 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
            default:
                return 'bg-neutral-100 text-neutral-900 border-neutral-300 font-bold';
        }
    };

    return (
        <>
            <Head>
                <title>My Orders ({orders.length}) - AURA ATELIER</title>
                <meta name="description" content="View and track your previous orders." />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-300">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight flex items-center gap-3">
                            <span>Order History & Tracking</span>
                            <span className="text-xs font-black text-neutral-950 bg-neutral-200 border border-neutral-300 px-3 py-1 rounded-full">
                                {orders.length} orders
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-800 font-medium mt-1">
                            Track shipments in real-time, view invoices, or re-order your favorite pieces.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1.5 bg-neutral-200 border border-neutral-300 rounded-2xl self-start sm:self-auto overflow-x-auto max-w-full">
                        {[
                            { id: 'all', label: 'All Orders' },
                            { id: 'active', label: 'In Progress' },
                            { id: 'delivered', label: 'Delivered' },
                            { id: 'cancelled', label: 'Cancelled' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                    statusFilter === tab.id
                                        ? 'bg-neutral-950 text-white shadow-xs'
                                        : 'text-neutral-700 hover:text-neutral-950'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-neutral-300 text-center shadow-sm">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-3xl">
                            📦
                        </div>
                        <h2 className="text-xl font-black text-neutral-950">No Orders Found</h2>
                        <p className="text-xs text-neutral-700 font-semibold mt-2 mb-6">
                            {statusFilter === 'all'
                                ? "You haven't placed any orders yet. Start exploring our atelier collections!"
                                : `No orders matching filter "${statusFilter}".`}
                        </p>
                        <Link href="/search">
                            <a className="inline-flex items-center justify-center px-6 py-3 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition shadow-sm">
                                Explore Store 🛍️
                            </a>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-3xl border border-neutral-300 p-6 sm:p-7 shadow-sm hover:border-neutral-400 transition space-y-5"
                            >
                                {/* Top Bar: ID, Date, Status */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="font-mono font-black text-sm text-neutral-950 bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-xl">
                                            #{order.id}
                                        </span>
                                        <span className="text-xs text-neutral-700 font-bold">
                                            Placed on {order.formattedDate || new Date(order.date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusBadge(
                                                order.status
                                            )}`}
                                        >
                                            ● {order.status}
                                        </span>
                                        <span className="text-base font-black text-neutral-950">
                                            ₹{order.pricing?.grandTotal}
                                        </span>
                                    </div>
                                </div>

                                {/* Center: Thumbnails & item summary */}
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {order.items?.slice(0, 4).map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="w-16 h-20 bg-neutral-100 rounded-xl p-1.5 flex items-center justify-center border border-neutral-200 flex-shrink-0"
                                                title={`${item.title} (Qty: ${item.qt || 1})`}
                                            >
                                                <Image
                                                    loader={imageLoader}
                                                    src={item.imgUrl}
                                                    alt={item.title}
                                                    width={55}
                                                    height={70}
                                                    objectFit="contain"
                                                />
                                            </div>
                                        ))}
                                        {order.items?.length > 4 && (
                                            <div className="w-16 h-20 bg-neutral-100 rounded-xl flex items-center justify-center text-xs font-black text-neutral-900 border border-neutral-300">
                                                +{order.items.length - 4} more
                                            </div>
                                        )}
                                        <div className="ml-2">
                                            <p className="text-xs font-black text-neutral-950">
                                                {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                                            </p>
                                            <p className="text-[11px] text-neutral-700 font-semibold mt-0.5">
                                                Est. Delivery: <span className="font-bold text-neutral-950">{order.estimatedDelivery}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-end">
                                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-300 rounded-xl transition"
                                            >
                                                Cancel Order
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => handleReorder(order)}
                                            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-950 text-xs font-bold rounded-xl transition"
                                        >
                                            🔁 Buy Again
                                        </button>

                                        <Link href={`/orders/${order.id}`}>
                                            <a className="px-5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition">
                                                Track & Details →
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
