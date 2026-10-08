import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';
import { useOrders } from '../context/order-context';
import { useWishlist } from '../context/wishlist-context';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, logout, updateProfile, savedAddresses, addAddress, removeAddress, setDefaultAddress } = useAuth();
    const { orders } = useOrders();
    const { wishlistCount } = useWishlist();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState('profile');
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        bio: user?.bio || ''
    });

    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        landmark: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '',
        tag: 'Home',
        isDefault: false
    });

    if (!isAuthenticated || !user) {
        return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-neutral-300 text-center shadow-sm">
                <span className="text-4xl block mb-3">🔒</span>
                <h1 className="text-xl font-black text-black">Sign In Required</h1>
                <p className="text-xs text-black font-bold mt-1 mb-6">Please sign in to view your profile and saved addresses.</p>
                <Link href="/login?redirect=/profile">
                    <a className="inline-flex px-6 py-2.5 bg-neutral-950 text-white text-xs font-black rounded-xl hover:bg-black transition">
                        Sign In Now
                    </a>
                </Link>
            </div>
        );
    }

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateProfile(editForm);
        showToast("Profile updated successfully!", "success");
    };

    const handleAddAddressSubmit = (e) => {
        e.preventDefault();
        if (!newAddress.street || !newAddress.pincode) {
            showToast("Please fill in street and PIN code.", "error");
            return;
        }
        addAddress(newAddress);
        setShowAddAddressModal(false);
        setNewAddress({
            fullName: user?.name || '',
            phone: user?.phone || '',
            street: '',
            landmark: '',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '',
            tag: 'Home',
            isDefault: false
        });
        showToast("New delivery address saved!", "success");
    };

    const handleLogout = () => {
        logout();
        showToast("Signed out successfully.", "info");
        router.push('/');
    };

    return (
        <>
            <Head>
                <title>My Profile - AURA ATELIER</title>
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Profile Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <Image
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={user.name}
                            width={80}
                            height={80}
                            unoptimized
                            className="rounded-2xl object-cover border-2 border-neutral-300 shadow-xs"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-black text-black">{user.name}</h1>
                                <span className="px-2.5 py-0.5 bg-neutral-950 text-white font-black text-[10px] rounded-full uppercase tracking-wider">
                                    Atelier Member
                                </span>
                            </div>
                            <p className="text-xs text-black font-black mt-0.5">{user.email} • {user.phone}</p>
                            <p className="text-xs text-black mt-1 font-bold italic">{user.bio || 'Curator of everyday aesthetics'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/orders">
                            <a className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-black rounded-xl transition">
                                📦 {orders.length} Orders
                            </a>
                        </Link>
                        <Link href="/wishlist">
                            <a className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 text-xs font-black rounded-xl transition">
                                ❤️ {wishlistCount} Wishlist
                            </a>
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-4 py-2 text-rose-800 hover:bg-rose-50 border border-rose-300 text-xs font-black rounded-xl transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* 2-Column Tabs & Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3 bg-white rounded-3xl p-3 border border-neutral-300 shadow-sm space-y-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black transition flex items-center gap-2.5 ${
                                activeTab === 'profile' ? 'bg-neutral-950 text-white' : 'text-black hover:bg-neutral-100'
                            }`}
                        >
                            <span>👤</span> Personal Details
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('addresses')}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black transition flex items-center gap-2.5 ${
                                activeTab === 'addresses' ? 'bg-neutral-950 text-white' : 'text-black hover:bg-neutral-100'
                            }`}
                        >
                            <span>📍</span> Saved Addresses ({savedAddresses.length})
                        </button>
                        <Link href="/orders">
                            <a className="w-full text-left px-4 py-3 rounded-2xl text-xs font-black text-black hover:bg-neutral-100 transition flex items-center gap-2.5">
                                <span>📦</span> Order History & Tracking
                            </a>
                        </Link>
                        <Link href="/wishlist">
                            <a className="w-full text-left px-4 py-3 rounded-2xl text-xs font-black text-black hover:bg-neutral-100 transition flex items-center gap-2.5">
                                <span>❤️</span> My Wishlist
                            </a>
                        </Link>
                    </div>

                    {/* Content Panel */}
                    <div className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-300 shadow-sm">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
                                <div>
                                    <h2 className="text-lg font-black text-black">Personal Information</h2>
                                    <p className="text-xs text-black font-bold mt-0.5">Manage your display name, contact phone, and bio.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-black text-black block mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-black font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-black block mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            disabled
                                            value={user.email}
                                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-100 text-black font-bold rounded-xl border border-neutral-300 cursor-not-allowed"
                                        />
                                        <span className="text-[10px] text-black font-bold">Email cannot be changed directly.</span>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-black block mb-1">Mobile Phone</label>
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-black font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-black block mb-1">About / Bio</label>
                                        <textarea
                                            rows="3"
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-black font-bold"
                                        ></textarea>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-black rounded-xl hover:bg-black transition shadow-sm"
                                >
                                    Save Profile Changes
                                </button>
                            </form>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-black text-black">Saved Shipping Addresses</h2>
                                        <p className="text-xs text-black font-bold mt-0.5">Manage delivery addresses for quick 1-click checkout.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddAddressModal(true)}
                                        className="px-4 py-2 bg-neutral-950 text-white text-xs font-black rounded-xl hover:bg-black transition shadow-sm flex items-center gap-1.5"
                                    >
                                        <span>+ Add New Address</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedAddresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            className={`p-5 rounded-2xl border transition ${
                                                addr.isDefault
                                                    ? 'bg-neutral-100 border-neutral-950 ring-1 ring-neutral-950'
                                                    : 'bg-white border-neutral-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-black text-[10px] font-black rounded-md uppercase">
                                                    {addr.tag || "Address"}
                                                </span>
                                                {addr.isDefault && (
                                                    <span className="text-[10px] font-black text-emerald-950 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                                                        ✓ Default
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-black text-sm text-black">{addr.fullName}</h3>
                                            <p className="text-xs text-black font-bold mt-1 leading-relaxed">{addr.street}</p>
                                            <p className="text-xs text-black font-bold">{addr.city}, {addr.state} - {addr.pincode}</p>
                                            <p className="text-xs text-black font-black mt-1">📞 {addr.phone}</p>

                                            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                                                {!addr.isDefault && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDefaultAddress(addr.id);
                                                            showToast("Set as default delivery address", "success");
                                                        }}
                                                        className="font-black text-black hover:underline underline"
                                                    >
                                                        Set Default
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        removeAddress(addr.id);
                                                        showToast("Address removed", "info");
                                                    }}
                                                    className="font-black text-rose-800 hover:text-rose-950 ml-auto"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Address Modal / Expandable Form */}
                                {showAddAddressModal && (
                                    <div className="p-6 bg-neutral-100 rounded-2xl border border-neutral-300 space-y-4 animate-fadeIn">
                                        <h3 className="text-sm font-black text-black">Add New Shipping Address</h3>
                                        <form onSubmit={handleAddAddressSubmit} className="space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Full Name"
                                                    value={newAddress.fullName}
                                                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-black font-bold"
                                                />
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="Phone Number"
                                                    value={newAddress.phone}
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-black font-bold"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Street / House / Flat / Apartment No."
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-black font-bold"
                                            />
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="City"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-black font-bold"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="State"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-black font-bold"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="PIN Code"
                                                    value={newAddress.pincode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-black font-bold"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <label className="flex items-center gap-2 text-xs text-black font-black cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={newAddress.isDefault}
                                                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                                        className="rounded text-black accent-black"
                                                    />
                                                    <span>Set as default shipping address</span>
                                                </label>

                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAddAddressModal(false)}
                                                        className="px-4 py-2 text-xs font-black text-black hover:bg-neutral-200 rounded-xl"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-5 py-2 bg-neutral-950 text-white text-xs font-black rounded-xl hover:bg-black"
                                                    >
                                                        Save Address
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
