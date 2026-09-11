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
        showToast("You have been signed out.", "info");
        router.push("/");
    };

    const isCurrentPath = (path) => router.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
            {/* Top Announcement Bar */}
            <div className="bg-slate-900 text-white text-[11px] font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
                <span>✨ <strong>SUMMER SALE:</strong> Get 20% OFF with code <strong className="text-amber-300 underline underline-offset-2">WELCOME20</strong></span>
                <span className="hidden md:inline text-slate-400">|</span>
                <span className="hidden md:inline text-slate-300">Free delivery on orders above ₹500</span>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    
                    {/* Mobile Hamburger & Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                )}
                            </svg>
                        </button>

                        <Link href="/">
                            <a className="flex items-center gap-2 group cursor-pointer">
                                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                                    A
                                </span>
                                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-slate-700 transition">
                                    AURA<span className="text-slate-400 font-light text-sm ml-1 uppercase tracking-widest">Style</span>
                                </span>
                            </a>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <Link href="/">
                            <a className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isCurrentPath('/') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}>
                                Home
                            </a>
                        </Link>
                        <Link href='/search?gender="Female"'>
                            <a className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                router.asPath.includes('Female') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}>
                                Women
                            </a>
                        </Link>
                        <Link href='/search?gender="Male"'>
                            <a className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                router.asPath.includes('Male') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}>
                                Men
                            </a>
                        </Link>
                        <Link href="/search">
                            <a className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isCurrentPath('/search') && !router.asPath.includes('gender') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}>
                                All Collections
                            </a>
                        </Link>
                        <Link href="/orders">
                            <a className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isCurrentPath('/orders') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}>
                                Orders
                            </a>
                        </Link>
                    </nav>

                    {/* Search Input Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xs mx-2">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search clothes, coats, dresses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 text-slate-800 placeholder-slate-400 rounded-full border border-transparent focus:border-slate-300 focus:bg-white focus:outline-none transition"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-slate-400 absolute left-3 top-2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </form>
                    </div>

                    {/* Right Utility Buttons (Wishlist, Cart, User) */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Wishlist Button */}
                        <Link href="/wishlist">
                            <a className="relative p-2 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition cursor-pointer" title="Wishlist">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                        {wishlistCount}
                                    </span>
                                )}
                            </a>
                        </Link>

                        {/* Cart Button */}
                        <Link href="/cart">
                            <a className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer" title="Shopping Cart">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                {totalCartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-slate-900 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
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
                                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none"
                                >
                                    <Image
                                        src={user.avatar}
                                        alt={user.name}
                                        width={28}
                                        height={28}
                                        unoptimized
                                        className="rounded-full object-cover border border-slate-300"
                                    />
                                    <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[90px] truncate">
                                        {user.name.split(" ")[0]}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-500">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            ) : (
                                <Link href="/login">
                                    <a className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        <span>Sign In</span>
                                    </a>
                                </Link>
                            )}

                            {/* Dropdown Menu */}
                            {userMenuOpen && isAuthenticated && user && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                                    <div className="px-4 py-2.5 border-b border-slate-100">
                                        <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                    </div>

                                    <div className="py-1">
                                        <Link href="/profile">
                                            <a
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                                            >
                                                <span>👤</span>
                                                <span>My Profile & Addresses</span>
                                            </a>
                                        </Link>
                                        <Link href="/orders">
                                            <a
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                                            >
                                                <span>📦</span>
                                                <span>My Orders & Tracking</span>
                                            </a>
                                        </Link>
                                        <Link href="/wishlist">
                                            <a
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                                            >
                                                <span>❤️</span>
                                                <span>My Wishlist ({wishlistCount})</span>
                                            </a>
                                        </Link>
                                    </div>

                                    <div className="border-t border-slate-100 pt-1">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition font-medium"
                                        >
                                            <span>🚪</span>
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
                    <div className="lg:hidden border-t border-slate-200 py-3 space-y-2 animate-fadeIn">
                        <form onSubmit={handleSearchSubmit} className="relative mb-3">
                            <input
                                type="text"
                                placeholder="Search catalog..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 text-slate-800 rounded-xl border border-slate-200 focus:outline-none"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-slate-400 absolute left-3 top-2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </form>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs font-medium">
                            <Link href="/">
                                <a onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100">🏠 Home</a>
                            </Link>
                            <Link href='/search?gender="Female"'>
                                <a onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100">👗 Women</a>
                            </Link>
                            <Link href='/search?gender="Male"'>
                                <a onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100">👔 Men</a>
                            </Link>
                            <Link href="/search">
                                <a onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100">🛍️ All Products</a>
                            </Link>
                            <Link href="/wishlist">
                                <a onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100">❤️ Wishlist ({wishlistCount})</a>
                            </Link>
                            <Link href="/orders">
                                <a onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100">📦 Orders</a>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};