import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-lg">
                                A
                            </span>
                            <span className="font-extrabold text-xl tracking-tight text-white">
                                AURA<span className="text-slate-400 font-light text-sm ml-1 uppercase tracking-widest">Style</span>
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                            Next-generation luxury fashion store with curated essentials, rapid express shipping, 7-day easy returns, and secure payments.
                        </p>
                        <div className="flex items-center gap-3 pt-2 text-slate-400 text-sm">
                            <span>Instagram</span> • <span>Pinterest</span> • <span>Twitter</span>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="space-y-3 text-xs">
                        <h4 className="font-bold text-white uppercase tracking-wider text-xs">Shop & Discover</h4>
                        <ul className="space-y-2">
                            <li><Link href='/search?gender="Female"'><a className="hover:text-white transition">Women&apos;s Collection</a></Link></li>
                            <li><Link href='/search?gender="Male"'><a className="hover:text-white transition">Men&apos;s Collection</a></Link></li>
                            <li><Link href='/search?categories=["Coats"]'><a className="hover:text-white transition">Winter Coats</a></Link></li>
                            <li><Link href='/search?categories=["Dresses"]'><a className="hover:text-white transition">Cocktail Dresses</a></Link></li>
                            <li><Link href="/search"><a className="hover:text-white transition">All Catalog</a></Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-3 text-xs">
                        <h4 className="font-bold text-white uppercase tracking-wider text-xs">Customer Care</h4>
                        <ul className="space-y-2">
                            <li><Link href="/orders"><a className="hover:text-white transition">Track Your Order</a></Link></li>
                            <li><Link href="/cart"><a className="hover:text-white transition">Shopping Bag</a></Link></li>
                            <li><Link href="/wishlist"><a className="hover:text-white transition">Saved Wishlist</a></Link></li>
                            <li><a href="#" className="hover:text-white transition">Shipping & Delivery Info</a></li>
                            <li><a href="#" className="hover:text-white transition">Returns & Exchanges</a></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="space-y-3 text-xs">
                        <h4 className="font-bold text-white uppercase tracking-wider text-xs">My Account</h4>
                        <ul className="space-y-2">
                            <li><Link href="/login"><a className="hover:text-white transition">Sign In</a></Link></li>
                            <li><Link href="/register"><a className="hover:text-white transition">Register Account</a></Link></li>
                            <li><Link href="/profile"><a className="hover:text-white transition">Saved Addresses</a></Link></li>
                            <li><Link href="/orders"><a className="hover:text-white transition">Purchase History</a></Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                    <p>© 2026 AURA STYLE Inc. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span>Privacy Policy</span>
                        <span>•</span>
                        <span>Terms of Service</span>
                        <span>•</span>
                        <span>Security</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};