import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "../elements/RatingStars";
import { useCart } from "../../context/cart-context";
import { useWishlist } from "../../context/wishlist-context";
import { useToast } from "../../context/toast-context";

const imageLoader = ({ src }) => {
    if (src && src.startsWith("http")) return src;
    return `/images/products/${src}`;
};

export const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();
    const [isHovered, setIsHovered] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    if (!product) return null;

    const wishlisted = isInWishlist(product.id);

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleWishlist(product);
        if (added) {
            showToast(`Added "${product.title}" to your Wishlist.`, "success");
        } else {
            showToast(`Removed "${product.title}" from your Wishlist.`, "info");
        }
    };

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        addToCart(product, 1);
        showToast(`"${product.title}" added to your shopping bag.`, "success");
        setTimeout(() => setIsAdding(false), 500);
    };

    const originalPrice = product.originalPrice || Math.round(Number(product.price) * 1.35);
    const discountPercent =
        product.discountPercent ||
        Math.round(((originalPrice - Number(product.price)) / originalPrice) * 100);

    return (
        <div
            className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#dfdcd3] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top Showcase Frame */}
            <div className="relative w-full bg-[#f8f7f4] p-5 flex items-center justify-center overflow-hidden border-b border-[#e8e6df]">
                
                {/* Floating Tags */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                    {discountPercent > 0 && (
                        <span className="bg-neutral-950 text-white font-black text-[10px] tracking-widest px-2.5 py-1 rounded shadow-xs uppercase">
                            -{discountPercent}%
                        </span>
                    )}
                    {product.isBestSeller && (
                        <span className="bg-white text-neutral-950 border border-neutral-400 font-black text-[10px] tracking-widest px-2.5 py-1 rounded shadow-xs uppercase">
                            Bestseller
                        </span>
                    )}
                    {product.isTrending && !product.isBestSeller && (
                        <span className="bg-neutral-900 text-white font-black text-[10px] tracking-widest px-2.5 py-1 rounded shadow-xs uppercase">
                            Trending
                        </span>
                    )}
                </div>

                {/* Wishlist Heart Button */}
                <button
                    type="button"
                    onClick={handleWishlistToggle}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs backdrop-blur-sm ${
                        wishlisted
                            ? "bg-rose-50 text-rose-600 scale-105 border border-rose-300"
                            : "bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-300"
                    }`}
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className={`w-4 h-4 transition-transform duration-200 ${
                            wishlisted ? "fill-rose-600 stroke-rose-600" : "fill-none stroke-current stroke-2"
                        }`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                </button>

                {/* Product Image Link */}
                <Link href={`/product/${product.id}`} className="block w-full text-center">
                    <div className="relative w-full h-56 flex items-center justify-center cursor-pointer transition-transform duration-500 group-hover:scale-105">
                        <Image
                            loader={imageLoader}
                            src={product.imgUrl}
                            alt={product.title}
                            width={190}
                            height={230}
                            objectFit="contain"
                            className="drop-shadow-xs"
                            priority={product.id <= 4}
                        />
                    </div>
                </Link>
            </div>

            {/* Product Meta & Details */}
            <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
                <div className="space-y-1.5">
                    {/* Category & Gender */}
                    <div className="flex items-center justify-between text-xs text-neutral-700 font-bold uppercase tracking-wider">
                        <span>{product.category || "Apparel"}</span>
                        <span>{product.gender === "M" ? "Men" : product.gender === "F" ? "Women" : "Unisex"}</span>
                    </div>

                    {/* Product Title */}
                    <Link href={`/product/${product.id}`}>
                        <h3 className="font-black text-neutral-950 text-base leading-snug line-clamp-1 hover:text-neutral-700 transition-colors cursor-pointer" title={product.title}>
                            {product.title}
                        </h3>
                    </Link>

                    {/* Rating & Stock Status */}
                    <div className="flex items-center justify-between pt-0.5">
                        <RatingStars
                            rating={product.rating || 4.8}
                            reviewCount={product.reviewCount || 94}
                            size="xs"
                        />
                        {product.stockCount && product.stockCount < 8 && (
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
                                {product.stockCount} left
                            </span>
                        )}
                    </div>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-3 border-t border-[#e8e6df] flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-neutral-950">
                                ₹{product.price}
                            </span>
                            {originalPrice > Number(product.price) && (
                                <span className="text-xs text-neutral-500 font-medium line-through">
                                    ₹{originalPrice}
                                </span>
                            )}
                        </div>
                        <span className="text-[11px] text-neutral-800 font-semibold">
                            Free Express Delivery
                        </span>
                    </div>

                    {/* Quick Add Button */}
                    <button
                        type="button"
                        onClick={handleQuickAdd}
                        disabled={isAdding}
                        className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-200 ${
                            isAdding
                                ? "bg-emerald-700 text-white scale-95"
                                : "bg-neutral-950 text-white hover:bg-black active:scale-95"
                        }`}
                        aria-label="Add to cart"
                    >
                        {isAdding ? (
                            <span>Added ✓</span>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <span>Add</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
