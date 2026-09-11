import Image from 'next/image';
import Link from 'next/link';
import bannerImg from "../public/images/banner-image.jpg";

export const Banner = () => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl">
            {/* Background Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative flex flex-col lg:flex-row items-center min-h-[480px]">
                {/* Left Visual Area with Floating Badges */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex items-center justify-center">
                    <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                        <Image
                            alt="Summer luxury fashion campaign"
                            src={bannerImg}
                            layout="fill"
                            objectFit="cover"
                            priority
                            className="transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                        {/* Floating Glassmorphism Tag 1 */}
                        <div className="absolute top-4 left-4 glass-card-dark px-3.5 py-1.5 rounded-xl flex items-center gap-2 border border-white/20 shadow-lg animate-floatSlow">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-[11px] font-bold text-white tracking-wide uppercase">
                                New 2026 Drop
                            </span>
                        </div>

                        {/* Floating Glassmorphism Tag 2 */}
                        <div className="absolute bottom-4 right-4 glass-card-dark p-3 rounded-2xl flex items-center gap-3 border border-white/20 shadow-xl backdrop-blur-md">
                            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-lg">
                                ⚡
                            </div>
                            <div>
                                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">Special Offer</span>
                                <span className="text-xs font-bold text-white">20% OFF: WELCOME20</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Copy Area */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-center space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 backdrop-blur-md">
                            ✨ LUXURY COUTURE & APPAREL
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20">
                            ★ 4.9 / 5.0 Rating
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                        Elevate Your Everyday <span className="text-gradient-aurora">Aesthetic</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                        Tailored from certified organic fibres, fine wools, and sustainable silks. Experience timeless silhouettes designed to turn heads everywhere you go.
                    </p>

                    {/* Quick Category Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {[
                            { label: "Winter Coats", href: '/search?categories=["Coats"]' },
                            { label: "Silk Blouses", href: '/search?categories=["Blouses"]' },
                            { label: "Cozy Knitwear", href: '/search?categories=["Sweaters"]' },
                            { label: "Evening Dresses", href: '/search?categories=["Dresses"]' }
                        ].map((chip, idx) => (
                            <Link key={idx} href={chip.href}>
                                <a className="px-3 py-1.5 bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-white/10 transition">
                                    {chip.label}
                                </a>
                            </Link>
                        ))}
                    </div>

                    {/* Action Buttons & Customer Proof */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Link href="/search">
                            <a className="px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm rounded-2xl shadow-xl transition transform active:scale-95 flex items-center gap-2">
                                <span>Explore All Catalog</span>
                                <span>→</span>
                            </a>
                        </Link>
                        <Link href="/cart">
                            <a className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 shadow-md transition">
                                🛍️ View Bag
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};