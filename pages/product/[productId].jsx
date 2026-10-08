import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '../../data/products';
import Spinner from '../../components/elements/Spinner';
import NumberCounter from '../../components/product/NumberCounter';
import { RatingStars } from '../../components/elements/RatingStars';
import { ProductCard } from '../../components/product/ProductCard';
import { useCart } from '../../context/cart-context';
import { useWishlist } from '../../context/wishlist-context';
import { useToast } from '../../context/toast-context';

const imageLoader = ({ src }) => {
    if (src && src.startsWith("http")) return src;
    return `/images/products/${src}`;
};

const ProductPage = () => {
    const router = useRouter();
    const { productId } = router.query;

    const [product, setProduct] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [activeTab, setActiveTab] = useState('description');
    const [pincode, setPincode] = useState('');
    const [deliveryMsg, setDeliveryMsg] = useState(null);
    const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
    const [reviewsList, setReviewsList] = useState([]);

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();

    useEffect(() => {
        if (productId) {
            const foundProduct = PRODUCTS.find((p) => String(p.id) === String(productId));

            if (foundProduct) {
                setProduct(foundProduct);
                setReviewsList(foundProduct.reviews || []);
            } else {
                setNotFound(true);
            }
            setLoading(false);
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (notFound || !product) {
        return (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-neutral-300 text-center shadow-sm">
                <span className="text-5xl block mb-4">🔍</span>
                <h1 className="text-2xl font-black text-black">Product Not Found</h1>
                <p className="text-sm text-black font-bold mt-2 mb-6">The item you are searching for might have been moved or is unavailable.</p>
                <Link href="/search">
                    <a className="inline-flex px-6 py-2.5 bg-black text-white text-sm font-black rounded-xl hover:bg-neutral-900 transition">
                        Browse All Products
                    </a>
                </Link>
            </div>
        );
    }

    const wishlisted = isInWishlist(product.id);
    const originalPrice = product.originalPrice || Math.round(Number(product.price) * 1.35);
    const discountPercent = product.discountPercent || Math.round(((originalPrice - Number(product.price)) / originalPrice) * 100);
    const savingsAmount = originalPrice - Number(product.price);

    const handleWishlistToggle = () => {
        const added = toggleWishlist(product);
        if (added) {
            showToast(`Added "${product.title}" to Wishlist ❤️`, "success");
        } else {
            showToast(`Removed "${product.title}" from Wishlist`, "info");
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        showToast(`Added ${quantity} × "${product.title}" to Cart 🛒`, "success");
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        router.push("/checkout");
    };

    const handleCheckPincode = (e) => {
        e.preventDefault();
        if (pincode.length >= 5) {
            setDeliveryMsg(`Standard delivery available to ${pincode} by 3 days! Express shipping available.`);
        } else {
            setDeliveryMsg("Please enter a valid 6-digit PIN code.");
        }
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        if (!newReview.name || !newReview.comment) {
            showToast("Please fill in your name and comment.", "error");
            return;
        }

        const reviewObj = {
            id: `rev_${Date.now()}`,
            userName: newReview.name,
            rating: Number(newReview.rating),
            date: "Just now",
            comment: newReview.comment,
            verified: true
        };

        setReviewsList([reviewObj, ...reviewsList]);
        setNewReview({ name: '', rating: 5, comment: '' });
        showToast("Thank you! Your review has been submitted.", "success");
    };

    const relatedProducts = PRODUCTS.filter(
        (p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender)
    ).slice(0, 4);

    const sizes = ['XS', 'S', 'M', 'L', 'XL'];

    return (
        <>
            <Head>
                <title>{product.title} - AURA ATELIER</title>
                <meta name="description" content={product.description} />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-black font-black pt-2">
                    <Link href="/"><a className="hover:underline">Home</a></Link>
                    <span className="text-black font-bold">/</span>
                    <Link href={`/search?category=${encodeURIComponent(product.category || '')}`}><a className="hover:underline">{product.category || 'Catalog'}</a></Link>
                    <span className="text-black font-bold">/</span>
                    <span className="text-black font-black truncate max-w-xs">{product.title}</span>
                </nav>

                {/* Main Product Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-[#dfdcd3] shadow-xs">
                    
                    {/* Left: Product Image Gallery View */}
                    <div className="lg:col-span-6 flex flex-col items-center justify-center bg-neutral-100 rounded-2xl p-6 sm:p-10 border border-neutral-200 relative group">
                        {/* Discount Badge */}
                        {discountPercent > 0 && (
                            <span className="absolute top-4 left-4 bg-rose-600 text-white font-black text-xs tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                                {discountPercent}% OFF
                            </span>
                        )}

                        {/* Wishlist Button */}
                        <button
                            type="button"
                            onClick={handleWishlistToggle}
                            className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md ${
                                wishlisted
                                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 scale-110"
                                    : "bg-white text-black hover:text-rose-600 border border-neutral-300"
                            }`}
                            aria-label="Wishlist"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-6 h-6 ${wishlisted ? "fill-rose-600 stroke-rose-600" : "fill-none stroke-current stroke-2"}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </button>

                        <div className="relative w-full max-w-sm h-80 sm:h-96 flex items-center justify-center">
                            <Image
                                loader={imageLoader}
                                src={product.imgUrl}
                                alt={product.title}
                                width={320}
                                height={420}
                                objectFit="contain"
                                className="drop-shadow-md"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right: Product Details & Purchase Actions */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                        <div>
                            {/* Category & Tags */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-widest text-black bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-300">
                                    {product.category}
                                </span>
                                {product.isBestSeller && (
                                    <span className="bg-amber-100 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-md border border-amber-300">
                                        ★ Best Seller
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight mt-3">
                                {product.title}
                            </h1>

                            {/* Rating & Review count */}
                            <div className="mt-3 flex items-center gap-3">
                                <RatingStars rating={product.rating || 4.7} reviewCount={reviewsList.length || product.reviewCount} size="sm" />
                                <span className="text-black font-bold">|</span>
                                <span className="text-xs text-emerald-800 font-black bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                                    In Stock ({product.stockCount || 15} available)
                                </span>
                            </div>

                            {/* Pricing Breakdown */}
                            <div className="mt-5 p-4 bg-neutral-50 rounded-2xl border border-neutral-300 flex items-baseline gap-3">
                                <span className="text-3xl font-black text-black">
                                    ₹{product.price}
                                </span>
                                {originalPrice > Number(product.price) && (
                                    <>
                                        <span className="text-base text-black/60 line-through font-black">
                                            ₹{originalPrice}
                                        </span>
                                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                                            Save ₹{savingsAmount} ({discountPercent}%)
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Short Description */}
                            <p className="text-sm text-black font-semibold leading-relaxed mt-4">
                                {product.description}
                            </p>

                            {/* Size Selection */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between text-xs font-black text-black mb-2">
                                    <span>SELECT SIZE</span>
                                    <button type="button" className="text-black hover:underline font-bold">Size Guide</button>
                                </div>
                                <div className="flex items-center gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-11 h-11 rounded-xl text-xs font-black transition flex items-center justify-center ${
                                                selectedSize === size
                                                    ? "bg-black text-white shadow-md"
                                                    : "bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-300"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity & CTA Buttons */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-black mb-1">Quantity:</span>
                                        <NumberCounter quantity={quantity} updateQuantity={setQuantity} min={1} max={product.stockCount || 10} />
                                    </div>
                                    <div className="flex-1 flex flex-col sm:flex-row gap-3 pt-5">
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            className="flex-1 py-3.5 px-6 rounded-2xl bg-black text-white font-black text-xs sm:text-sm shadow-md hover:bg-neutral-900 active:scale-95 transition flex items-center justify-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                            <span>Add to Cart</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleBuyNow}
                                            className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md hover:bg-emerald-800 active:scale-95 transition flex items-center justify-center gap-2"
                                        >
                                            <span>⚡ Buy Now</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Pincode Delivery Checker */}
                            <div className="mt-6 pt-6 border-t border-neutral-200">
                                <span className="text-xs font-black text-black block mb-2">Check Estimated Delivery</span>
                                <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-sm">
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit PIN code"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        className="flex-1 px-3.5 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-300 font-bold text-black focus:outline-none focus:bg-white focus:border-black"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-black text-white hover:bg-neutral-900 rounded-xl text-xs font-black transition"
                                    >
                                        Check
                                    </button>
                                </form>
                                {deliveryMsg && (
                                    <p className="text-xs text-black font-black mt-2 animate-fadeIn">{deliveryMsg}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs: Specifications & Customer Reviews */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#dfdcd3] shadow-xs space-y-6">
                    <div className="flex border-b border-neutral-200">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-4 px-6 text-sm font-black transition border-b-2 ${
                                activeTab === 'description' ? 'border-black text-black' : 'border-transparent text-black/70 hover:text-black'
                            }`}
                        >
                            Description & Details
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 px-6 text-sm font-black transition border-b-2 flex items-center gap-2 ${
                                activeTab === 'reviews' ? 'border-black text-black' : 'border-transparent text-black/70 hover:text-black'
                            }`}
                        >
                            <span>Customer Reviews</span>
                            <span className="bg-neutral-100 text-black border border-neutral-300 px-2 py-0.5 rounded-full text-xs font-bold">
                                {reviewsList.length}
                            </span>
                        </button>
                    </div>

                    {activeTab === 'description' ? (
                        <div className="space-y-4 max-w-3xl">
                            <p className="text-sm text-black font-semibold leading-relaxed">{product.description}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-300">
                                    <span className="text-[11px] text-black font-black uppercase tracking-wider block">Category</span>
                                    <span className="text-sm font-black text-black">{product.category}</span>
                                </div>
                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-300">
                                    <span className="text-[11px] text-black font-black uppercase tracking-wider block">Color Palette</span>
                                    <span className="text-sm font-black text-black">{product.color || "Standard Natural"}</span>
                                </div>
                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-300">
                                    <span className="text-[11px] text-black font-black uppercase tracking-wider block">Gender Fit</span>
                                    <span className="text-sm font-black text-black">
                                        {product.gender === 'M' ? 'Male / Men' : product.gender === 'F' ? 'Female / Women' : 'Unisex Atelier'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Reviews list */}
                            <div className="space-y-4">
                                {reviewsList.map((rev) => (
                                    <div key={rev.id} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-full bg-black text-white font-black text-xs flex items-center justify-center">
                                                    {rev.userName[0]}
                                                </span>
                                                <span className="font-black text-sm text-black">{rev.userName}</span>
                                                {rev.verified && (
                                                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded border border-emerald-400">
                                                        ✓ Verified Buyer
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-black font-bold">{rev.date}</span>
                                        </div>
                                        <div className="my-2">
                                            <RatingStars rating={rev.rating} showNumber={false} size="xs" />
                                        </div>
                                        <p className="text-xs text-black font-bold leading-relaxed">{rev.comment}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Write Review Form */}
                            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-300">
                                <h3 className="text-sm font-black text-black mb-3">Write a Customer Review</h3>
                                <form onSubmit={handleAddReview} className="space-y-3 max-w-xl">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Your Full Name"
                                            value={newReview.name}
                                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                            className="px-3.5 py-2 text-xs font-bold text-black bg-white rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                                        />
                                        <select
                                            value={newReview.rating}
                                            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                                            className="px-3.5 py-2 text-xs font-bold text-black bg-white rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                                        >
                                            <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                                            <option value="4">⭐⭐⭐⭐ (4 - Great)</option>
                                            <option value="3">⭐⭐⭐ (3 - Good)</option>
                                            <option value="2">⭐⭐ (2 - Fair)</option>
                                            <option value="1">⭐ (1 - Poor)</option>
                                        </select>
                                    </div>
                                    <textarea
                                        rows="3"
                                        placeholder="Share your thoughts about this product..."
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full px-3.5 py-2 text-xs font-bold text-black bg-white rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-neutral-900 transition shadow-sm"
                                    >
                                        Submit Review
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="pt-6">
                        <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight mb-6">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductPage;