import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../../context/cart-context";
import { useWishlist } from "../../context/wishlist-context";
import { useAuth } from "../../context/auth-context";
import { useToast } from "../../context/toast-context";

export const Header = () => {
    const router = useRouter();
    const { cart } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, isAuthenticated, logout } = useAuth();
    const { showToast } = useToast();

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const userMenuRef = useRef(null);

    // Calculate total cart items
    const totalCartCount = (cart || []).reduce((acc, item) => acc + (Number(item.qt) || 1), 0);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        showToast("Signed out of your Aura account.", "info");
        router.push("/");
    };

    const isCurrentPath = (path) => router.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#dfdcd3] shadow-xs transition-all">
            {/* Top Announcement Bar */}
            <div className="bg-black text-white text-xs font-semibold py-2.5 px-4 text-center tracking-wider flex items-center justify-center gap-3">
                <span className="tracking-widest uppercase">Complimentary Express Delivery on Orders Over ₹500</span>
                <span className="hidden md:inline text-neutral-400">•</span>
                <span className="hidden md:inline text-neutral-200">
                    Use Privilege Code <strong className="text-white font-mono font-black underline underline-offset-2">WELCOME20</strong> For 20% Off
                </span>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
                    
                    {/* Mobile Hamburger & Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl text-neutral-900 hover:bg-neutral-100 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-6 h-6">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                )}
                            </svg>
                        </button>

                        <Link href="/">
                            <a className="flex items-center gap-3 group cursor-pointer">
                                <span className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-black text-base tracking-tight shadow-xs group-hover:scale-105 transition-transform">
                                    A
                                </span>
                                <div className="flex flex-col">
                                    <span className="font-black text-xl tracking-tight text-black group-hover:text-black transition leading-none">
                                        AURA
                                    </span>
                                    <span className="text-[10px] font-black text-black tracking-[0.25em] uppercase mt-0.5">
                                        Atelier Studio
                                    </span>
                                </div>
                            </a>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <Link href="/">
                            <a className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-colors ${
                                isCurrentPath('/') ? 'text-black bg-neutral-200/80 ring-1 ring-black/10' : 'text-black hover:text-black hover:bg-neutral-100'
                            }`}>
                                Home
                            </a>
                        </Link>
                        <Link href='/search?gender="Female"'>
                            <a className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-colors ${
                                router.asPath.includes('Female') ? 'text-black bg-neutral-200/80 ring-1 ring-black/10' : 'text-black hover:text-black hover:bg-neutral-100'
                            }`}>
                                Women
                            </a>
                        </Link>
                        <Link href='/search?gender="Male"'>
                            <a className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-colors ${
                                router.asPath.includes('Male') ? 'text-black bg-neutral-200/80 ring-1 ring-black/10' : 'text-black hover:text-black hover:bg-neutral-100'
                            }`}>
                                Men
                            </a>
                        </Link>
                        <Link href="/search">
                            <a className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-colors ${
                                isCurrentPath('/search') && !router.asPath.includes('gender') ? 'text-black bg-neutral-200/80 ring-1 ring-black/10' : 'text-black hover:text-black hover:bg-neutral-100'
                            }`}>
                                All Collections
                            </a>
                        </Link>
                        <Link href="/orders">
                            <a className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-colors ${
                                isCurrentPath('/orders') ? 'text-black bg-neutral-200/80 ring-1 ring-black/10' : 'text-black hover:text-black hover:bg-neutral-100'
                            }`}>
                                Orders
                            </a>
                        </Link>
                    </nav>

                    {/* Search Input Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xs mx-4">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search coats, silks, knitwear..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-xs font-bold bg-neutral-100 text-black placeholder-neutral-600 rounded-full border border-neutral-300 focus:border-black focus:bg-white focus:outline-none transition shadow-2xs"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-black absolute left-3.5 top-2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </form>
                    </div>

                    {/* Right Utility Buttons (Wishlist, Cart, User) */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Wishlist Button */}
                        <Link href="/wishlist">
                            <a className="relative p-2.5 text-black hover:bg-neutral-100 rounded-xl transition cursor-pointer" title="Wishlist">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                                {wishlistCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 bg-neutral-950 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                                        {wishlistCount}
                                    </span>
                                )}
                            </a>
                        </Link>

                        {/* Cart Button */}
                        <Link href="/cart">
                            <a className="relative p-2.5 text-black hover:bg-neutral-100 rounded-xl transition cursor-pointer" title="Shopping Bag">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                {totalCartCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 bg-neutral-950 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                                        {totalCartCount}
                                    </span>
                                )}
                            </a>
                        </Link>

                        {/* User Account / Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            {isAuthenticated && user ? (
                                <button
                                    type="button"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-100 transition focus:outline-none"
                                >
                                    <Image
                                        src={user.avatar}
                                        alt={user.name}
                                        width={28}
                                        height={28}
                                        unoptimized
                                        className="rounded-full object-cover border border-neutral-400"
                                    />
                                    <span className="hidden md:inline text-xs font-black text-black max-w-[90px] truncate">
                                        {user.name.split(" ")[0]}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-black">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            ) : (
                                <Link href="/login">
                                    <a className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider text-black bg-neutral-200/90 hover:bg-neutral-950 hover:text-white rounded-xl transition border border-neutral-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        <span>Sign In</span>
                                    </a>
                                </Link>
                            )}

                            {/* Dropdown Menu */}
                            {userMenuOpen && isAuthenticated && user && (
                                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-neutral-300 py-2 z-50 animate-fadeIn">
                                    <div className="px-4 py-3 border-b border-neutral-200">
                                        <p className="text-xs font-black text-black truncate">{user.name}</p>
                                        <p className="text-[11px] text-black font-bold truncate">{user.email}</p>
                                    </div>

                                    <div className="py-1">
                                        <Link href="/profile">
                                            <a
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-black hover:bg-neutral-100 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-black">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                <span>Profile & Addresses</span>
                                            </a>
                                        </Link>
                                        <Link href="/orders">
                                            <a
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-black hover:bg-neutral-100 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-black">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                </svg>
                                                <span>Orders & Tracking</span>
                                            </a>
                                        </Link>
                                        <Link href="/wishlist">
                                            <a
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-black hover:bg-neutral-100 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-black">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                                </svg>
                                                <span>Wishlist ({wishlistCount})</span>
                                            </a>
                                        </Link>
                                    </div>

                                    <div className="border-t border-neutral-200 pt-1">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-xs text-rose-800 hover:bg-rose-50 transition font-black"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-rose-700">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                            </svg>
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-neutral-300 py-4 space-y-3 animate-fadeIn">
                        <form onSubmit={handleSearchSubmit} className="relative mb-3">
                            <input
                                type="text"
                                placeholder="Search catalog..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-neutral-100 text-black rounded-xl border border-neutral-300 focus:outline-none"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-neutral-700 absolute left-3.5 top-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </form>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs font-black uppercase tracking-wider">
                            <Link href="/">
                                <a onClick={() => setMobileMenuOpen(false)} className="p-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 text-black">
                                    Home
                                </a>
                            </Link>
                            <Link href='/search?gender="Female"'>
                                <a onClick={() => setMobileMenuOpen(false)} className="p-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 text-black">
                                    Women
                                </a>
                            </Link>
                            <Link href='/search?gender="Male"'>
                                <a onClick={() => setMobileMenuOpen(false)} className="p-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 text-black">
                                    Men
                                </a>
                            </Link>
                            <Link href="/search">
                                <a onClick={() => setMobileMenuOpen(false)} className="p-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 text-black">
                                    All Catalog
                                </a>
                            </Link>
                            <Link href="/wishlist">
                                <a onClick={() => setMobileMenuOpen(false)} className="p-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 text-black">
                                    Wishlist ({wishlistCount})
                                </a>
                            </Link>
                            <Link href="/orders">
                                <a onClick={() => setMobileMenuOpen(false)} className="p-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 text-black">
                                    Orders
                                </a>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};