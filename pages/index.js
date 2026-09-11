import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Banner } from '../components/Banner';
import { CategoriesSection } from '../components/CategoriesSection';
import { ProductCard } from '../components/product/ProductCard';
import { Footer } from '../components/Footer';
import { useToast } from '../context/toast-context';
import { PRODUCTS } from '../data/products';

export default function Home() {
    const { showToast } = useToast();
    const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Live countdown timer for Flash Deals (simulated live ticking)
    const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 19 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return { hours: 12, minutes: 0, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Filtered products for the interactive live tabs
    const categoryTabs = ['All', 'Shirts', 'Coats', 'Blouses', 'Sweaters', 'Dresses', 'Pants'];
    const tabFilteredProducts = PRODUCTS.filter((p) => {
        if (selectedCategoryTab === 'All') return true;
        return p.category.toLowerCase() === selectedCategoryTab.toLowerCase();
    }).slice(0, 8);

    const flashDeals = PRODUCTS.filter((p) => (p.discountPercent || 0) >= 28).slice(0, 4);
    const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail && newsletterEmail.includes('@')) {
            setIsSubscribed(true);
            showToast("🎉 You've unlocked 20% OFF! Code: WELCOME20 applied.", "success");
            setNewsletterEmail('');
        } else {
            showToast("Please enter a valid email address.", "error");
        }
    };

    return (
        <>
            <Head>
                <title>AURA STYLE | Luxury Modern Fashion, Apparel & Accessories</title>
                <meta name="description" content="Discover premium apparel, structured winter coats, silk blouses, and timeless wardrobe essentials with express worldwide shipping and easy returns." />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                
                {/* 1. Hero Showcase Section */}
                <div className="relative">
                    <Banner />
                </div>

                {/* 2. Glassmorphic Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <div className="glass-panel p-4 sm:p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/80 bg-white/80">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">
                            🚚
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Free Express Delivery</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">On orders above ₹500</p>
                        </div>
                    </div>

                    <div className="glass-panel p-4 sm:p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/80 bg-white/80">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl flex-shrink-0">
                            🔒
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">256-Bit Encrypted</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">UPI, Cards & NetBanking</p>
                        </div>
                    </div>

                    <div className="glass-panel p-4 sm:p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/80 bg-white/80">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0">
                            ✨
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">100% Authentic</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Certified premium fabrics</p>
                        </div>
                    </div>

                    <div className="glass-panel p-4 sm:p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/80 bg-white/80">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl flex-shrink-0">
                            🔄
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">7-Day Easy Returns</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Instant refunds guaranteed</p>
                        </div>
                    </div>
                </div>

                {/* 3. Browse Collections Categories */}
                <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm bg-white/80">
                    <CategoriesSection />
                </div>

                {/* 4. Flash Deals with Live Countdown Timer */}
                <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-rose-900/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-rose-500/30">
                                <span>⚡ LIMITED TIME DROP</span>
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                                Flash Deals & High Discounts
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1">
                                Save up to 40% on top trending autumn silhouettes before timer ends.
                            </p>
                        </div>

                        {/* Live Countdown Box */}
                        <div className="flex items-center gap-2 bg-slate-900/90 border border-white/10 p-2.5 sm:p-3 rounded-2xl backdrop-blur-md self-start md:self-auto">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Ends In:</span>
                            <div className="flex items-center gap-1.5 font-mono">
                                <span className="bg-rose-600 text-white text-xs sm:text-sm font-black px-2.5 py-1.5 rounded-lg shadow-inner">
                                    {String(timeLeft.hours).padStart(2, '0')}h
                                </span>
                                <span className="font-bold text-rose-400">:</span>
                                <span className="bg-rose-600 text-white text-xs sm:text-sm font-black px-2.5 py-1.5 rounded-lg shadow-inner">
                                    {String(timeLeft.minutes).padStart(2, '0')}m
                                </span>
                                <span className="font-bold text-rose-400">:</span>
                                <span className="bg-rose-600 text-white text-xs sm:text-sm font-black px-2.5 py-1.5 rounded-lg shadow-inner">
                                    {String(timeLeft.seconds).padStart(2, '0')}s
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {flashDeals.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* 5. Interactive Category Showcase Tabs */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                                🌟 Curated Catalog
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                                Explore Trending Wardrobe Pieces
                            </h2>
                        </div>

                        {/* Tab Switchers */}
                        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl overflow-x-auto max-w-full backdrop-blur-sm">
                            {categoryTabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setSelectedCategoryTab(tab)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                        selectedCategoryTab === tab
                                            ? 'bg-white text-slate-900 shadow-sm scale-102'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tabFilteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="text-center pt-4">
                        <Link href="/search">
                            <a className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-2xl hover:bg-slate-800 transition shadow-lg transform active:scale-95">
                                <span>Browse Entire 24+ Item Collection</span>
                                <span>→</span>
                            </a>
                        </Link>
                    </div>
                </div>

                {/* 6. Editorial Lookbook Double Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Editorial 1: The Winter Trench */}
                    <div className="group relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[340px] border border-slate-800 shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent z-10" />
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/images/categories/coats.webp"
                                layout="fill"
                                objectFit="cover"
                                alt="Coats editorial"
                                className="group-hover:scale-105 transition-transform duration-700 opacity-60"
                            />
                        </div>
                        <div className="relative z-20 space-y-2">
                            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
                                Editorial Spotlight
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black">
                                The Minimalist Outerwear
                            </h3>
                            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                                Heavy wool coats, trench tailoring, and double-breasted finishes designed to outlast seasons.
                            </p>
                        </div>
                        <div className="relative z-20 pt-6">
                            <Link href='/search?categories=["Coats"]'>
                                <a className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 text-xs font-extrabold rounded-xl hover:bg-slate-100 transition shadow-md">
                                    <span>Shop Outerwear</span>
                                    <span>→</span>
                                </a>
                            </Link>
                        </div>
                    </div>

                    {/* Editorial 2: The Silk & Satin Edit */}
                    <div className="group relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[340px] border border-slate-800 shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent z-10" />
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/images/categories/blouses.webp"
                                layout="fill"
                                objectFit="cover"
                                alt="Blouses editorial"
                                className="group-hover:scale-105 transition-transform duration-700 opacity-60"
                            />
                        </div>
                        <div className="relative z-20 space-y-2">
                            <span className="text-[11px] font-bold text-rose-300 uppercase tracking-widest">
                                Feminine Essentials
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black">
                                Pure Silk & Satin Blouses
                            </h3>
                            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                                Delicate pleats, French cuffs, and effortless silhouettes crafted for every day and night.
                            </p>
                        </div>
                        <div className="relative z-20 pt-6">
                            <Link href='/search?categories=["Blouses"]'>
                                <a className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 text-xs font-extrabold rounded-xl hover:bg-slate-100 transition shadow-md">
                                    <span>Shop Blouses</span>
                                    <span>→</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 7. Verified Customer Reviews / Social Proof */}
                <div className="space-y-6">
                    <div className="text-center max-w-xl mx-auto">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                            💬 Customer Reviews
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                            Loved by 50,000+ Fashion Lovers
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Real experiences from verified buyers across India & globally.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 bg-white/90">
                            <div className="flex items-center gap-1 text-amber-400 text-sm">
                                ★★★★★
                            </div>
                            <p className="text-xs text-slate-700 italic leading-relaxed">
                                &quot;The Ruby Red Trench Coat is pure perfection. The weight and tailoring feel like bespoke designer luxury. Arrived in Mumbai in just 2 days!&quot;
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                    SK
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">Sneha Kapoor</h4>
                                    <span className="text-[10px] text-emerald-600 font-semibold">✓ Verified Buyer</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 bg-white/90">
                            <div className="flex items-center gap-1 text-amber-400 text-sm">
                                ★★★★★
                            </div>
                            <p className="text-xs text-slate-700 italic leading-relaxed">
                                &quot;The Beige Joggers and Sweater combo is my new daily uniform. Organic cotton feels breathable and super durable after several washes.&quot;
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                                    RV
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">Rohan Varma</h4>
                                    <span className="text-[10px] text-emerald-600 font-semibold">✓ Verified Buyer</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 bg-white/90">
                            <div className="flex items-center gap-1 text-amber-400 text-sm">
                                ★★★★★
                            </div>
                            <p className="text-xs text-slate-700 italic leading-relaxed">
                                &quot;Checkout was effortless with UPI and 1-Click login. Live order tracking map kept me updated from dispatched to doorstep delivery!&quot;
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                    AP
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">Ananya Patel</h4>
                                    <span className="text-[10px] text-emerald-600 font-semibold">✓ Verified Buyer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 8. VIP Club & Newsletter Box */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 border border-indigo-900/50 shadow-2xl">
                    <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
                        <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-bold tracking-widest uppercase text-amber-300 inline-block border border-white/20">
                            🎁 AURA VIP CLUB
                        </span>
                        
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                            Join The Inner Circle & Get 20% OFF
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Subscribe for secret flash sales, early access to seasonal lookbooks, and receive your instant 20% coupon code <strong className="text-amber-300">WELCOME20</strong>.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email address..."
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 focus:border-white transition flex-1 backdrop-blur-md"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold rounded-2xl transition shadow-lg transform active:scale-95"
                            >
                                {isSubscribed ? "Subscribed! ✓" : "Unlock 20% OFF"}
                            </button>
                        </form>
                    </div>
                </div>

            </div>

            <div className="mt-20">
                <Footer />
            </div>
        </>
    );
}
