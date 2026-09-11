import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../context/cart-context';
import { useToast } from '../context/toast-context';
import { CartItemRow } from '../components/cart/ProductContainer';
import { AVAILABLE_COUPONS } from '../data/coupons';

const Cart = () => {
    const router = useRouter();
    const {
        cart,
        subtotal,
        tax,
        deliveryCharge,
        discount,
        grandTotal,
        totalItemsCount,
        amountNeededForFreeDelivery,
        freeDeliveryThreshold,
        appliedCoupon,
        applyCouponCode,
        removeCouponCode,
        clearCart
    } = useCart();
    const { showToast } = useToast();

    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = (codeToApply) => {
        const code = codeToApply || couponInput;
        if (!code) {
            setCouponError("Please enter a coupon code");
            return;
        }

        const result = applyCouponCode(code);
        if (result.valid) {
            setCouponError('');
            setCouponInput('');
            showToast(result.message, "success");
        } else {
            setCouponError(result.message);
            showToast(result.message, "error");
        }
    };

    const handleRemoveCoupon = () => {
        removeCouponCode();
        showToast("Coupon removed", "info");
    };

    const handleClearCart = () => {
        if (confirm("Are you sure you want to remove all items from your cart?")) {
            clearCart();
            showToast("Cart cleared", "info");
        }
    };

    const progressPercentage = Math.min(100, Math.round(((freeDeliveryThreshold - amountNeededForFreeDelivery) / freeDeliveryThreshold) * 100));

    if (!cart || cart.length === 0) {
        return (
            <>
                <Head>
                    <title>Your Shopping Cart is Empty - AURA STYLE</title>
                </Head>
                <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200/80 text-center shadow-xs">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                        🛒
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
                    <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
                        Looks like you have not added anything yet. Explore our curated catalog of apparel and coats!
                    </p>
                    <Link href="/search">
                        <a className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-sm">
                            Explore Collections 🛍️
                        </a>
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Shopping Cart ({totalItemsCount} items) - AURA STYLE</title>
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            <span>Shopping Cart</span>
                            <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                {totalItemsCount} items
                            </span>
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={handleClearCart}
                        className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition"
                    >
                        Clear Cart
                    </button>
                </div>

                {/* 2-Column Cart Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Free Shipping Progress Indicator */}
                        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                                <span>
                                    {amountNeededForFreeDelivery > 0
                                        ? `Add ₹${amountNeededForFreeDelivery} more to qualify for FREE Delivery! 🚚`
                                        : `🎉 Congratulations! You have unlocked FREE Delivery!`}
                                </span>
                                <span>{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-3">
                            {cart.map((product) => (
                                <CartItemRow key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Continue Shopping Link */}
                        <div className="pt-2">
                            <Link href="/search">
                                <a className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition">
                                    <span>←</span> Continue Shopping
                                </a>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Order Summary Sidebar */}
                    <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm sticky top-28 space-y-6">
                        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Order Summary
                        </h2>

                        {/* Pricing Breakdown */}
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal ({totalItemsCount} items)</span>
                                <span className="font-semibold text-slate-900">₹{subtotal}</span>
                            </div>

                            <div className="flex justify-between text-slate-600">
                                <span>Estimated Tax (10% GST)</span>
                                <span className="font-semibold text-slate-900">₹{tax}</span>
                            </div>

                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Fee</span>
                                {deliveryCharge === 0 ? (
                                    <span className="font-bold text-emerald-600">FREE</span>
                                ) : (
                                    <span className="font-semibold text-slate-900">₹{deliveryCharge}</span>
                                )}
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 p-2 rounded-xl">
                                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}

                            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                                <span className="text-sm font-bold text-slate-900">Grand Total</span>
                                <span className="text-2xl font-extrabold text-slate-900">₹{grandTotal}</span>
                            </div>
                        </div>

                        {/* Coupon Code Box */}
                        <div className="pt-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                                Apply Promo Code
                            </label>

                            {appliedCoupon ? (
                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-emerald-200 rounded-2xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-600 font-bold text-xs">✓ {appliedCoupon.code}</span>
                                        <span className="text-[11px] text-slate-500">applied</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="e.g. WELCOME20"
                                            value={couponInput}
                                            onChange={(e) => {
                                                setCouponInput(e.target.value.toUpperCase());
                                                setCouponError('');
                                            }}
                                            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 uppercase font-semibold rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleApplyCoupon()}
                                            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p className="text-[11px] text-rose-500 mt-1.5">{couponError}</p>
                                    )}

                                    {/* Available Coupons Badges */}
                                    <div className="mt-3">
                                        <span className="text-[10px] text-slate-400 font-semibold block mb-1.5">Tap to apply:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {AVAILABLE_COUPONS.map((c) => (
                                                <button
                                                    key={c.code}
                                                    type="button"
                                                    onClick={() => handleApplyCoupon(c.code)}
                                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 transition"
                                                >
                                                    {c.code}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Checkout CTA Button */}
                        <button
                            type="button"
                            onClick={() => router.push('/checkout')}
                            className="w-full py-4 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-slate-800 shadow-md active:scale-98 transition flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Checkout</span>
                            <span>→</span>
                        </button>

                        {/* Trust info */}
                        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium border-t border-slate-100">
                            <span className="flex items-center gap-1">🔒 256-Bit SSL</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">⚡ Fast Shipping</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">🔄 Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;