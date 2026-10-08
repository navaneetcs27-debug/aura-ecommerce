import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '../context/toast-context';
import bannerImg from "../public/images/banner-image.jpg";

export const Banner = () => {
    const { showToast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopyPromo = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText("WELCOME20");
        setCopied(true);
        showToast("Code 'WELCOME20' copied. 20% discount applied at checkout.", "info");
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <section className="relative overflow-hidden rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
            <div className="flex flex-col lg:flex-row items-stretch min-h-[560px]">
                
                {/* Left: Editorial Copy & Collections */}
                <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-14 xl:p-16 flex flex-col justify-between space-y-8 z-10 bg-white">
                    
                    {/* Top Eyebrow / Campaign Meta */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400">
                                Autumn / Winter 2026
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                            <span className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">
                                Atelier Edition 01
                            </span>
                        </div>

                        {/* Master High-Contrast Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-neutral-900 leading-[1.04]">
                            Timeless Form. <br />
                            <span className="font-serif-luxury italic font-normal text-neutral-700">
                                Exceptional Silhouettes.
                            </span>
                        </h1>

                        {/* High-Readability Editorial Body */}
                        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg font-normal pt-1">
                            Architecturally tailored from certified organic merino wool, raw cashmere, and fluid mulberry silks. Foundational wardrobe pieces designed to outlast transient trends.
                        </p>
                    </div>

                    {/* Curated Collection Chips */}
                    <div className="space-y-2.5 pt-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block">
                            Curated Lines
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: "Outerwear & Coats", href: '/search?categories=["Coats"]' },
                                { label: "Pure Silk Blouses", href: '/search?categories=["Blouses"]' },
                                { label: "Merino Knitwear", href: '/search?categories=["Sweaters"]' },
                                { label: "Evening Dresses", href: '/search?categories=["Dresses"]' },
                                { label: "Tailored Shirts", href: '/search?categories=["Shirts"]' }
                            ].map((chip, idx) => (
                                <Link key={idx} href={chip.href}>
                                    <a className="px-3.5 py-1.5 bg-neutral-50 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-medium rounded-lg border border-neutral-200 transition-colors duration-200">
                                        {chip.label}
                                    </a>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTAs & Promo Code Banner */}
                    <div className="space-y-4 pt-2">
                        <div className="flex flex-wrap items-center gap-3.5">
                            <Link href="/search">
                                <a className="px-8 py-3.5 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl transition duration-200 shadow-sm active:scale-95 flex items-center gap-3">
                                    <span>Explore Collection</span>
                                    <span className="text-base leading-none">→</span>
                                </a>
                            </Link>
                            <Link href="/cart">
                                <a className="px-7 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl border border-neutral-300 transition duration-200 active:scale-95">
                                    View Bag
                                </a>
                            </Link>
                        </div>

                        {/* Minimalist Promo Offer Banner */}
                        <div className="inline-flex items-center gap-3 bg-neutral-50 border border-neutral-200/80 px-4 py-2 rounded-xl text-xs text-neutral-700">
                            <span className="font-medium">Welcome Privilege:</span>
                            <span className="text-neutral-500">20% off with code</span>
                            <span className="font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-300">
                                WELCOME20
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyPromo}
                                className="font-semibold text-neutral-900 hover:text-indigo-600 underline underline-offset-2 ml-1 cursor-pointer transition"
                            >
                                {copied ? "Copied ✓" : "Copy Code"}
                            </button>
                        </div>
                    </div>

                    {/* Editorial Quality Guarantees */}
                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-neutral-100 text-xs text-neutral-500 font-medium">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Complimentary Express Delivery
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                            Certified Sustainable Textiles
                        </span>
                        <span className="hidden sm:flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                            7-Day Doorstep Returns
                        </span>
                    </div>

                </div>

                {/* Right: Editorial Campaign Photography Frame */}
                <div className="w-full lg:w-5/12 relative min-h-[400px] lg:min-h-full bg-neutral-100 border-t lg:border-t-0 lg:border-l border-neutral-200/80">
                    <div className="relative w-full h-full min-h-[400px] lg:min-h-full">
                        <Image
                            alt="Autumn Winter Luxury Atelier Campaign"
                            src={bannerImg}
                            layout="fill"
                            objectFit="cover"
                            priority
                            className="transition-transform duration-700 hover:scale-102"
                        />
                        
                        {/* Minimalist Editorial Corner Labels */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-neutral-200/80 text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-900 shadow-xs">
                            Look 04 // Autumn 2026
                        </div>

                        <div className="absolute bottom-4 right-4 bg-neutral-900/90 text-white backdrop-blur-md px-3.5 py-2 rounded-lg text-[11px] font-medium tracking-wider shadow-sm">
                            Tailored Double-Breasted Trench
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};