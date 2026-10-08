import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '../context/toast-context';

const LOOKS = [
    {
        id: "01",
        season: "Autumn / Winter 2026",
        edition: "Atelier Drop 01",
        titleMain: "Timeless Form.",
        titleSerif: "Exceptional Silhouettes.",
        description: "Architecturally tailored from certified double-faced virgin wool and raw cashmere. Foundational wardrobe pieces designed to outlast transient fashion cycles.",
        fabricSpec: "480 GSM Double-Faced Virgin Wool",
        ctaLabel: "Explore Outerwear",
        ctaLink: '/search?categories=["Coats"]',
        imageSrc: "/images/banner-image.jpg",
        imageAlt: "Autumn Winter Luxury Atelier Trench Look",
        itemTag: "Tailored Double-Breasted Trench",
        itemPrice: "₹4,299",
        chips: [
            { label: "Outerwear & Coats", href: '/search?categories=["Coats"]' },
            { label: "Pure Silk Blouses", href: '/search?categories=["Blouses"]' },
            { label: "Merino Knitwear", href: '/search?categories=["Sweaters"]' },
            { label: "Evening Dresses", href: '/search?categories=["Dresses"]' }
        ]
    },
    {
        id: "02",
        season: "Spring / Capsule 2026",
        edition: "Atelier Drop 02",
        titleMain: "Fluid Silks.",
        titleSerif: "Effortless Draping.",
        description: "Woven from 100% Grade-6A Mulberry silk with hand-rolled French seams. Designed with subtle fluid movement that transitions effortlessly from daytime tailoring into evening events.",
        fabricSpec: "100% Grade-6A Mulberry Silk",
        ctaLabel: "Explore Silk Edit",
        ctaLink: '/search?categories=["Blouses"]',
        imageSrc: "/images/categories/blouses.webp",
        imageAlt: "Fluid Mulberry Silk Atelier Look",
        itemTag: "Ivory Silk Pleated Shirt",
        itemPrice: "₹2,499",
        chips: [
            { label: "Mulberry Silk Blouses", href: '/search?categories=["Blouses"]' },
            { label: "Tailored Shirts", href: '/search?categories=["Shirts"]' },
            { label: "Pleated Trousers", href: '/search?categories=["Pants"]' },
            { label: "Cocktail Dresses", href: '/search?categories=["Dresses"]' }
        ]
    },
    {
        id: "03",
        season: "Essential Foundations",
        edition: "Atelier Drop 03",
        titleMain: "Sculpted Knitwear.",
        titleSerif: "Quiet Sophistication.",
        description: "Spun from 19.5-micron Australian extra-fine Merino wool in natural un-dyed earth tones. Unrivalled softness with lasting dimensional resilience wash after wash.",
        fabricSpec: "19.5μ Extra-Fine Merino Wool",
        ctaLabel: "Explore Knitwear",
        ctaLink: '/search?categories=["Sweaters"]',
        imageSrc: "/images/categories/sweaters.webp",
        imageAlt: "Merino Wool Knitwear Atelier Look",
        itemTag: "Oatmeal Ribbed Merino Pullover",
        itemPrice: "₹1,999",
        chips: [
            { label: "Merino Sweaters", href: '/search?categories=["Sweaters"]' },
            { label: "Tailored Coats", href: '/search?categories=["Coats"]' },
            { label: "Wool Trousers", href: '/search?categories=["Pants"]' },
            { label: "All Catalog", href: '/search' }
        ]
    }
];

export const Banner = () => {
    const { showToast } = useToast();
    const [currentLookIdx, setCurrentLookIdx] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-advance looks smoothly every 6 seconds unless user is hovering
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentLookIdx((prev) => (prev + 1) % LOOKS.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isPaused]);

    const activeLook = LOOKS[currentLookIdx];

    const handleCopyPromo = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText("WELCOME20");
        setCopied(true);
        showToast("Privilege code 'WELCOME20' copied. 20% discount unlocked!", "success");
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <section 
            className="relative overflow-hidden rounded-3xl bg-white border border-[#dfdcd3] shadow-md"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="flex flex-col lg:flex-row items-stretch min-h-[580px]">
                
                {/* Left Column: High-Contrast Master Editorial & Navigation */}
                <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-14 xl:p-16 flex flex-col justify-between space-y-8 z-10 bg-white">
                    
                    {/* Top: Campaign Meta & Interactive Look Switcher */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs font-black tracking-[0.25em] uppercase text-black">
                                    {activeLook.season}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span className="text-xs font-black tracking-widest uppercase text-black">
                                    {activeLook.edition}
                                </span>
                            </div>

                            {/* Interactive Lookbook Tabs */}
                            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-300">
                                {LOOKS.map((look, idx) => (
                                    <button
                                        key={look.id}
                                        type="button"
                                        onClick={() => setCurrentLookIdx(idx)}
                                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider uppercase transition-all ${
                                            currentLookIdx === idx
                                                ? 'bg-black text-white shadow-sm'
                                                : 'text-black hover:bg-neutral-200'
                                        }`}
                                    >
                                        Look {look.id}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Master High-Contrast Headline */}
                        <div className="min-h-[120px] sm:min-h-[140px] flex flex-col justify-center">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-black leading-[1.04]">
                                {activeLook.titleMain} <br />
                                <span className="font-serif-luxury italic font-bold text-black">
                                    {activeLook.titleSerif}
                                </span>
                            </h1>
                        </div>

                        {/* High-Readability Editorial Body */}
                        <p className="text-sm sm:text-base text-black font-semibold leading-relaxed max-w-lg">
                            {activeLook.description}
                        </p>

                        {/* Material Provenance Badge */}
                        <div className="inline-flex items-center gap-2 pt-1 text-xs bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-300">
                            <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                            <span className="font-black text-black tracking-wide">Textile Spec:</span>
                            <span className="text-black font-bold">{activeLook.fabricSpec}</span>
                        </div>
                    </div>

                    {/* Curated Collection Chips */}
                    <div className="space-y-2 pt-1">
                        <span className="text-xs font-black tracking-widest uppercase text-black block">
                            Direct Catalog Jump
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {activeLook.chips.map((chip, idx) => (
                                <Link key={idx} href={chip.href}>
                                    <a className="px-4 py-2 bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-black rounded-xl border border-neutral-300 transition-colors duration-200 shadow-2xs">
                                        {chip.label}
                                    </a>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Action CTAs & Privilege Promo Box */}
                    <div className="space-y-4 pt-2">
                        <div className="flex flex-wrap items-center gap-3.5">
                            <Link href={activeLook.ctaLink}>
                                <a className="px-8 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-black tracking-wider uppercase rounded-xl transition duration-200 shadow-md active:scale-95 flex items-center gap-3">
                                    <span>{activeLook.ctaLabel}</span>
                                    <span className="text-base leading-none">→</span>
                                </a>
                            </Link>
                            <Link href="/cart">
                                <a className="px-7 py-3.5 bg-white hover:bg-black hover:text-white text-black text-xs sm:text-sm font-black tracking-wider uppercase rounded-xl border-2 border-black transition duration-200 active:scale-95">
                                    View Bag
                                </a>
                            </Link>
                        </div>

                        {/* Privilege Voucher Pill */}
                        <div className="inline-flex items-center gap-2.5 bg-neutral-100 border border-neutral-300 px-4 py-2.5 rounded-xl text-xs text-black">
                            <span className="font-black text-black">Welcome Privilege:</span>
                            <span className="text-black font-bold">20% off with</span>
                            <span className="font-mono font-black text-black bg-white px-2.5 py-1 rounded-md border border-neutral-400 shadow-2xs">
                                WELCOME20
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyPromo}
                                className="font-black text-black hover:underline ml-1 cursor-pointer transition"
                            >
                                {copied ? "Copied ✓" : "Copy Code"}
                            </button>
                        </div>
                    </div>

                    {/* Human Editorial Standard Markers */}
                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-neutral-300 text-xs text-black font-black">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-black" />
                            Complimentary Express Delivery
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-black" />
                            Certified Natural Fibres
                        </span>
                        <span className="hidden sm:flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-black" />
                            7-Day Doorstep Returns
                        </span>
                    </div>

                </div>

                {/* Right Column: Editorial Lookbook Image Display */}
                <div className="w-full lg:w-5/12 relative min-h-[420px] lg:min-h-full bg-neutral-200 border-t lg:border-t-0 lg:border-l border-neutral-300 overflow-hidden">
                    <div className="relative w-full h-full min-h-[420px] lg:min-h-full">
                        <Image
                            key={activeLook.imageSrc}
                            alt={activeLook.imageAlt}
                            src={activeLook.imageSrc}
                            layout="fill"
                            objectFit="cover"
                            priority
                            className="transition-all duration-700 hover:scale-102"
                        />
                        
                        {/* Top Editorial Corner Tag */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-neutral-300 text-xs font-black tracking-[0.2em] uppercase text-black shadow-md">
                            {`Look ${activeLook.id} • ${activeLook.season.split(" ")[0]} 2026`}
                        </div>

                        {/* Bottom Item Price Tag */}
                        <div className="absolute bottom-4 right-4 bg-neutral-950 text-white backdrop-blur-md px-4 py-3 rounded-xl border border-neutral-800 shadow-xl flex items-center gap-3">
                            <div>
                                <p className="text-xs font-semibold text-neutral-300">{activeLook.itemTag}</p>
                                <p className="text-sm font-black text-white tracking-wide">{activeLook.itemPrice}</p>
                            </div>
                            <Link href={activeLook.ctaLink}>
                                <a className="w-8 h-8 rounded-lg bg-white text-neutral-950 flex items-center justify-center font-black text-sm hover:bg-neutral-200 transition shadow-sm">
                                    →
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};