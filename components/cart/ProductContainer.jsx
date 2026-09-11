import React from "react";
import Image from "next/image";
import Link from "next/link";
import NumberCounter from "../../components/product/NumberCounter";
import { useCart } from "../../context/cart-context";
import { useWishlist } from "../../context/wishlist-context";
import { useToast } from "../../context/toast-context";

const imageLoader = ({ src }) => {
    if (src && src.startsWith("http")) return src;
    return `/images/products/${src}`;
};

export const CartItemRow = ({ product }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const { addToWishlist } = useWishlist();
    const { showToast } = useToast();

    if (!product) return null;

    const unitPrice = Number(product.price) || 0;
    const quantity = Number(product.qt) || 1;
    const itemTotal = unitPrice * quantity;

    const handleRemove = () => {
        removeFromCart(product.id);
        showToast(`Removed "${product.title}" from Cart`, "info");
    };

    const handleMoveToWishlist = () => {
        addToWishlist(product);
        removeFromCart(product.id);
        showToast(`Moved "${product.title}" to Wishlist ❤️`, "success");
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-slate-300 transition gap-4">
            {/* Left: Thumbnail & Info */}
            <div className="flex items-center gap-4 flex-1">
                <Link href={`/product/${product.id}`}>
                    <div className="w-20 h-24 sm:w-24 sm:h-28 bg-slate-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0 cursor-pointer border border-slate-100 hover:opacity-90 transition">
                        <Image
                            loader={imageLoader}
                            src={product.imgUrl}
                            alt={product.title}
                            width={90}
                            height={110}
                            objectFit="contain"
                        />
                    </div>
                </Link>

                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {product.category || "Apparel"}
                    </span>
                    <Link href={`/product/${product.id}`}>
                        <a className="font-bold text-sm sm:text-base text-slate-900 hover:text-slate-700 transition line-clamp-1">
                            {product.title}
                        </a>
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Unit Price: <span className="font-semibold text-slate-800">₹{unitPrice}</span>
                    </p>

                    {/* Quick Move to Wishlist action */}
                    <button
                        type="button"
                        onClick={handleMoveToWishlist}
                        className="text-left text-xs font-medium text-slate-500 hover:text-rose-600 transition mt-2 inline-flex items-center gap-1"
                    >
                        <span>❤️</span> Move to Wishlist
                    </button>
                </div>
            </div>

            {/* Right: Quantity Stepper, Item Total & Remove */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Quantity */}
                <div className="flex flex-col items-center">
                    <NumberCounter
                        quantity={quantity}
                        updateQuantity={(newQty) => updateQuantity(product.id, newQty)}
                        size="sm"
                    />
                </div>

                {/* Total */}
                <div className="text-right min-w-[70px]">
                    <span className="text-xs text-slate-400 block sm:hidden">Total</span>
                    <span className="text-base sm:text-lg font-bold text-slate-900">
                        ₹{itemTotal}
                    </span>
                </div>

                {/* Remove Button */}
                <button
                    type="button"
                    onClick={handleRemove}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Remove from Cart"
                    aria-label="Remove item"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CartItemRow;