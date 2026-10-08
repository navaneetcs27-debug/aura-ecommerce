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
                    <title>Your Shopping Bag is Empty - AURA ATELIER</title>
                </Head>
                <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-[#dfdcd3] text-center shadow-xs">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center text-3xl">
                        🛍️
                    </div>
                    <h2 className="text-xl font-black text-neutral-950">Your Shopping Bag is Empty</h2>
                    <p className="text-xs text-neutral-700 mt-2 mb-6 leading-relaxed font-medium">
                        Explore our curated atelier catalog of pure silks, merino knitwear, and architectural coats.
                    </p>
                    <Link href="/search">
                        <a className="inline-flex items-center justify-center px-7 py-3.5 bg-neutral-950 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-black transition shadow-sm">
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
                <title>Shopping Bag ({totalItemsCount} items) - AURA ATELIER</title>
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight flex items-center gap-2.5">
                            <span>Shopping Bag</span>
                            <span className="text-xs font-black text-neutral-950 bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-full">
                                {totalItemsCount} items
                            </span>
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={handleClearCart}
                        className="text-xs font-bold text-rose-700 hover:bg-rose-50 px-3.5 py-1.5 rounded-xl transition"
                    >
                        Clear Bag
                    </button>
                </div>

                {/* 2-Column Cart Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Free Shipping Progress Indicator */}
                        <div className="p-4 bg-white border border-[#dfdcd3] rounded-2xl shadow-2xs">
                            <div className="flex items-center justify-between text-xs font-bold text-neutral-950 mb-2">
                                <span>
                                    {amountNeededForFreeDelivery > 0
                                        ? `Add ₹${amountNeededForFreeDelivery} more to unlock COMPLIMENTARY Express Delivery! 🚚`
                                        : `🎉 Congratulations! You have unlocked COMPLIMENTARY Express Delivery!`}
                                </span>
                                <span className="font-black">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden border border-neutral-200">
                                <div
                                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
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
                                <a className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-900 hover:text-black transition">
                                    <span>←</span> Continue Shopping
                                </a>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Order Summary Sidebar */}
                    <div className="lg:col-span-4 bg-white border border-[#dfdcd3] rounded-3xl p-6 shadow-sm sticky top-36 space-y-6">
                        <h2 className="text-lg font-black text-neutral-950 border-b border-neutral-100 pb-3">
                            Order Summary
                        </h2>

                        {/* Pricing Breakdown */}
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between text-neutral-800 font-medium">
                                <span>Subtotal ({totalItemsCount} items)</span>
                                <span className="font-bold text-neutral-950">₹{subtotal}</span>
                            </div>

                            <div className="flex justify-between text-neutral-800 font-medium">
                                <span>Estimated Tax (10% GST)</span>
                                <span className="font-bold text-neutral-950">₹{tax}</span>
                            </div>

                            <div className="flex justify-between text-neutral-800 font-medium">
                                <span>Delivery Fee</span>
                                {deliveryCharge === 0 ? (
                                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                                ) : (
                                    <span className="font-bold text-neutral-950">₹{deliveryCharge}</span>
                                )}
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                                    <span>Privilege Coupon ({appliedCoupon?.code})</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}

                            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                                <span className="text-sm font-black text-neutral-950">Grand Total</span>
                                <span className="text-2xl font-black text-neutral-950">₹{grandTotal}</span>
                            </div>
                        </div>

                        {/* Coupon Code Box */}
                        <div className="pt-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-neutral-800 block mb-2">
                                Apply Privilege Code
                            </label>

                            {appliedCoupon ? (
                                <div className="flex items-center justify-between p-3 bg-neutral-50 border border-emerald-400 rounded-2xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-800 font-black text-xs font-mono">✓ {appliedCoupon.code}</span>
                                        <span className="text-[11px] text-neutral-700 font-semibold">applied</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        className="text-xs font-bold text-rose-700 hover:text-rose-900"
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
                                            className="flex-1 px-3.5 py-2.5 text-xs bg-neutral-50 uppercase font-bold text-neutral-950 rounded-xl border border-neutral-300 focus:outline-none focus:bg-white focus:border-neutral-950"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleApplyCoupon()}
                                            className="px-4 py-2 bg-neutral-950 text-white text-xs font-extrabold rounded-xl hover:bg-black transition"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p className="text-[11px] text-rose-600 font-bold mt-1.5">{couponError}</p>
                                    )}

                                    {/* Available Coupons Badges */}
                                    <div className="mt-3">
                                        <span className="text-[10px] text-neutral-700 font-bold uppercase tracking-wider block mb-1.5">Tap code to apply:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {AVAILABLE_COUPONS.map((c) => (
                                                <button
                                                    key={c.code}
                                                    type="button"
                                                    onClick={() => handleApplyCoupon(c.code)}
                                                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-950 hover:text-white text-neutral-900 text-[10px] font-extrabold rounded-lg border border-neutral-300 transition"
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
                            className="w-full py-4 bg-neutral-950 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl hover:bg-black shadow-md active:scale-98 transition flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Checkout</span>
                            <span>→</span>
                        </button>

                        {/* Trust info */}
                        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-neutral-700 font-bold border-t border-neutral-100">
                            <span className="flex items-center gap-1">🔒 256-Bit SSL</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">⚡ Express Delivery</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">🔄 7-Day Returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;