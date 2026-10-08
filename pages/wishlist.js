import Head from 'next/head';
import Link from 'next/link';
import { useWishlist } from '../context/wishlist-context';
import { useCart } from '../context/cart-context';
import { useToast } from '../context/toast-context';
import { ProductCard } from '../components/product/ProductCard';

export default function WishlistPage() {
    const { wishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleMoveAllToCart = () => {
        if (!wishlist || wishlist.length === 0) return;
        wishlist.forEach((item) => {
            addToCart(item, 1);
        });
        clearWishlist();
        showToast("Moved all wishlist items to Cart! 🛒", "success");
    };

    const handleClearWishlist = () => {
        if (confirm("Are you sure you want to clear your entire wishlist?")) {
            clearWishlist();
            showToast("Wishlist cleared", "info");
        }
    };

    return (
        <>
            <Head>
                <title>My Wishlist ({wishlist ? wishlist.length : 0}) - AURA ATELIER</title>
                <meta name="description" content="View and manage your saved wishlist items." />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight flex items-center gap-2.5">
                            <span>My Wishlist</span>
                            <span className="text-rose-600">❤️</span>
                            <span className="text-xs font-black text-black bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-full">
                                {wishlist ? wishlist.length : 0} items
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-black font-bold mt-1">
                            Save your favorite pieces here and add them to your bag whenever you are ready.
                        </p>
                    </div>

                    {wishlist && wishlist.length > 0 && (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleClearWishlist}
                                className="px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition"
                            >
                                Clear Wishlist
                            </button>
                            <button
                                type="button"
                                onClick={handleMoveAllToCart}
                                className="px-5 py-2.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-neutral-900 transition shadow-sm flex items-center gap-2"
                            >
                                <span>🛒 Move All to Bag</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {!wishlist || wishlist.length === 0 ? (
                    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-[#dfdcd3] text-center shadow-xs">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center text-3xl">
                            ❤️
                        </div>
                        <h2 className="text-xl font-black text-black">Your Wishlist is Empty</h2>
                        <p className="text-xs text-black font-bold mt-2 mb-6 leading-relaxed">
                            Explore our latest collections and click the heart icon on any product to save your favorites!
                        </p>
                        <Link href="/search">
                            <a className="inline-flex items-center justify-center px-7 py-3.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-neutral-900 transition shadow-sm">
                                Start Shopping Now 🛍️
                            </a>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

