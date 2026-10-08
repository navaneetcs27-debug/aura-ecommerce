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

                {/* 2. Editorial Trust & Service Markers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <div className="p-5 rounded-2xl flex items-center gap-4 border border-neutral-200/90 bg-white shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75a1.125 1.125 0 00-1.125-1.125H3.375A1.125 1.125 0 002.25 3.75v10.5h12m0 0V9.75" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Complimentary Delivery</h4>
                            <p className="text-[11px] text-neutral-500 mt-0.5">On orders above ₹500</p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl flex items-center gap-4 border border-neutral-200/90 bg-white shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Encrypted Payments</h4>
                            <p className="text-[11px] text-neutral-500 mt-0.5">UPI, Cards & NetBanking</p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl flex items-center gap-4 border border-neutral-200/90 bg-white shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Certified Authentic</h4>
                            <p className="text-[11px] text-neutral-500 mt-0.5">Organic silk & wool fibres</p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl flex items-center gap-4 border border-neutral-200/90 bg-white shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900">7-Day Easy Returns</h4>
                            <p className="text-[11px] text-neutral-500 mt-0.5">Instant refunds guaranteed</p>
                        </div>
                    </div>
                </div>

                {/* 3. Browse Collections Categories */}
                <div className="rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs bg-white">
                    <CategoriesSection />
                </div>

                {/* 4. Seasonal Archive Drop with Live Countdown */}
                <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-neutral-700">
                                <span>Private Archive // Limited Release</span>
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                                Seasonal Archive Drops
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                                Exceptional investment pieces with private reductions up to 35% before archive closure.
                            </p>
                        </div>

                        {/* Live Countdown Box */}
                        <div className="flex items-center gap-2 bg-black/60 border border-neutral-700 p-2.5 sm:p-3 rounded-2xl backdrop-blur-md self-start md:self-auto">
                            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mr-1">Archive Closes:</span>
                            <div className="flex items-center gap-1.5 font-mono">
                                <span className="bg-white text-neutral-900 text-xs sm:text-sm font-black px-2.5 py-1.5 rounded-lg shadow-sm">
                                    {String(timeLeft.hours).padStart(2, '0')}h
                                </span>
                                <span className="font-bold text-neutral-500">:</span>
                                <span className="bg-white text-neutral-900 text-xs sm:text-sm font-black px-2.5 py-1.5 rounded-lg shadow-sm">
                                    {String(timeLeft.minutes).padStart(2, '0')}m
                                </span>
                                <span className="font-bold text-neutral-500">:</span>
                                <span className="bg-white text-neutral-900 text-xs sm:text-sm font-black px-2.5 py-1.5 rounded-lg shadow-sm">
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
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                                Current Atelier Rotation
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
                                Essential Wardrobe Foundations
                            </h2>
                        </div>

                        {/* Tab Switchers */}
                        <div className="flex items-center gap-1 bg-neutral-100 p-1.5 rounded-xl overflow-x-auto max-w-full border border-neutral-200">
                            {categoryTabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setSelectedCategoryTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                                        selectedCategoryTab === tab
                                            ? 'bg-neutral-900 text-white shadow-xs'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
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
                            <a className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-xl hover:bg-black transition shadow-sm active:scale-95">
                                <span>Explore Entire 24+ Item Collection</span>
                                <span>→</span>
                            </a>
                        </Link>
                    </div>
                </div>

                {/* 6. Editorial Lookbook Double Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Editorial 1: The Winter Trench */}
                    <div className="group relative rounded-3xl overflow-hidden bg-neutral-900 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[360px] border border-neutral-800 shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent z-10" />
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/images/categories/coats.webp"
                                layout="fill"
                                objectFit="cover"
                                alt="Coats editorial"
                                className="group-hover:scale-105 transition-transform duration-700 opacity-70"
                            />
                        </div>
                        <div className="relative z-20 space-y-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.25em]">
                                Editorial Lookbook // 01
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black">
                                The Minimalist Outerwear
                            </h3>
                            <p className="text-xs text-neutral-300 max-w-xs leading-relaxed">
                                Heavy pure wool overcoats, architectural trench lines, and double-breasted tailoring crafted to outlast seasons.
                            </p>
                        </div>
                        <div className="relative z-20 pt-6">
                            <Link href='/search?categories=["Coats"]'>
                                <a className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-100 transition shadow-sm">
                                    <span>Shop Outerwear</span>
                                    <span>→</span>
                                </a>
                            </Link>
                        </div>
                    </div>

                    {/* Editorial 2: The Silk & Satin Edit */}
                    <div className="group relative rounded-3xl overflow-hidden bg-neutral-900 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[360px] border border-neutral-800 shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent z-10" />
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/images/categories/blouses.webp"
                                layout="fill"
                                objectFit="cover"
                                alt="Blouses editorial"
                                className="group-hover:scale-105 transition-transform duration-700 opacity-70"
                            />
                        </div>
                        <div className="relative z-20 space-y-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.25em]">
                                Editorial Lookbook // 02
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black">
                                Pure Silk & Satin Silhouettes
                            </h3>
                            <p className="text-xs text-neutral-300 max-w-xs leading-relaxed">
                                Delicate pleats, French cuffs, and effortless fluid draping designed for both day and evening attire.
                            </p>
                        </div>
                        <div className="relative z-20 pt-6">
                            <Link href='/search?categories=["Blouses"]'>
                                <a className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-100 transition shadow-sm">
                                    <span>Shop Blouses</span>
                                    <span>→</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 7. Client Reflections / Social Proof */}
                <div className="space-y-6">
                    <div className="text-center max-w-xl mx-auto">
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
                            Client Reflections
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
                            Trusted by 50,000+ Patrons Worldwide
                        </h2>
                        <p className="text-xs text-neutral-500 mt-1">
                            Real experiences from verified clients across India and globally.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl border border-neutral-200/90 bg-white shadow-xs space-y-3">
                            <div className="flex items-center gap-1 text-neutral-900 text-sm">
                                ★★★★★
                            </div>
                            <p className="text-xs text-neutral-700 italic leading-relaxed">
                                &quot;The Ruby Red Trench Coat is pure perfection. The tailoring and textile weight rival bespoke luxury ateliers. Arrived in Mumbai in 2 business days.&quot;
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-900">Sneha Kapoor</h4>
                                    <span className="text-[10px] text-neutral-400 font-medium">Mumbai, MH</span>
                                </div>
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200/60">Verified Order</span>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-neutral-200/90 bg-white shadow-xs space-y-3">
                            <div className="flex items-center gap-1 text-neutral-900 text-sm">
                                ★★★★★
                            </div>
                            <p className="text-xs text-neutral-700 italic leading-relaxed">
                                &quot;The Beige Joggers and Merino Sweater pairing is extraordinary. Organic fibres are breathable, exceptionally structured, and maintain shape wash after wash.&quot;
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-900">Rohan Varma</h4>
                                    <span className="text-[10px] text-neutral-400 font-medium">Bengaluru, KA</span>
                                </div>
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200/60">Verified Order</span>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-neutral-200/90 bg-white shadow-xs space-y-3">
                            <div className="flex items-center gap-1 text-neutral-900 text-sm">
                                ★★★★★
                            </div>
                            <p className="text-xs text-neutral-700 italic leading-relaxed">
                                &quot;Seamless checkout experience with instantaneous confirmation and live map tracking. The garment packaging and fabric hand-feel are unmatched.&quot;
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-900">Ananya Patel</h4>
                                    <span className="text-[10px] text-neutral-400 font-medium">New Delhi, DL</span>
                                </div>
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200/60">Verified Order</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 8. The Atelier Guestlist & Newsletter */}
                <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-8 sm:p-14 border border-neutral-800 shadow-xl">
                    <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
                        <span className="px-3.5 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-300 inline-block border border-white/10">
                            The Aura Atelier // Private Guestlist
                        </span>
                        
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                            Receive Private Archive Invitations
                        </h2>

                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg mx-auto">
                            Subscribe to receive early access to seasonal lookbooks, bespoke private drops, and your 20% courtesy privilege with code <strong className="text-white font-mono">WELCOME20</strong>.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email address..."
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                className="px-4 py-3 bg-white/10 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-400 focus:outline-none focus:bg-white/20 focus:border-white transition flex-1"
                            />
                            <button
                                type="submit"
                                className="px-7 py-3 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md active:scale-95 flex-shrink-0"
                            >
                                {isSubscribed ? "Subscribed ✓" : "Join Guestlist"}
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
