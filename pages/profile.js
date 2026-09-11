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
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
                <span className="text-4xl block mb-3">🔒</span>
                <h1 className="text-xl font-bold text-slate-900">Sign In Required</h1>
                <p className="text-xs text-slate-500 mt-1 mb-6">Please sign in to view your profile and saved addresses.</p>
                <Link href="/login?redirect=/profile">
                    <a className="inline-flex px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">
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
                <title>My Profile - AURA STYLE</title>
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Profile Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <Image
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={user.name}
                            width={80}
                            height={80}
                            unoptimized
                            className="rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user.name}</h1>
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded-full uppercase">
                                    Gold Member
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{user.email} • {user.phone}</p>
                            <p className="text-xs text-slate-400 mt-1 italic font-light">{user.bio || 'Fashion enthusiast'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/orders">
                            <a className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition">
                                📦 {orders.length} Orders
                            </a>
                        </Link>
                        <Link href="/wishlist">
                            <a className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition">
                                ❤️ {wishlistCount} Wishlist
                            </a>
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-4 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* 2-Column Tabs & Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3 bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs space-y-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
                                activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span>👤</span> Personal Details
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('addresses')}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
                                activeTab === 'addresses' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span>📍</span> Saved Addresses ({savedAddresses.length})
                        </button>
                        <Link href="/orders">
                            <a className="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-2.5">
                                <span>📦</span> Order History & Tracking
                            </a>
                        </Link>
                        <Link href="/wishlist">
                            <a className="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-2.5">
                                <span>❤️</span> My Wishlist
                            </a>
                        </Link>
                    </div>

                    {/* Content Panel */}
                    <div className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Manage your display name, contact phone, and bio.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            disabled
                                            value={user.email}
                                            className="w-full px-3.5 py-2.5 text-xs bg-slate-100 text-slate-500 rounded-xl border border-slate-200 cursor-not-allowed"
                                        />
                                        <span className="text-[10px] text-slate-400">Email cannot be changed directly.</span>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone</label>
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">About / Bio</label>
                                        <textarea
                                            rows="3"
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                                        ></textarea>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-sm"
                                >
                                    Save Profile Changes
                                </button>
                            </form>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Saved Shipping Addresses</h2>
                                        <p className="text-xs text-slate-500 mt-0.5">Manage delivery addresses for quick 1-click checkout.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddAddressModal(true)}
                                        className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-sm flex items-center gap-1.5"
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
                                                    ? 'bg-slate-50/80 border-slate-900 ring-1 ring-slate-900'
                                                    : 'bg-white border-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded-md uppercase">
                                                    {addr.tag || "Address"}
                                                </span>
                                                {addr.isDefault && (
                                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                        ✓ Default
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-bold text-sm text-slate-900">{addr.fullName}</h3>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{addr.street}</p>
                                            <p className="text-xs text-slate-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                                            <p className="text-xs text-slate-500 mt-1">📞 {addr.phone}</p>

                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                                {!addr.isDefault && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDefaultAddress(addr.id);
                                                            showToast("Set as default delivery address", "success");
                                                        }}
                                                        className="font-semibold text-slate-700 hover:text-slate-900"
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
                                                    className="font-semibold text-rose-600 hover:text-rose-800 ml-auto"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Address Modal / Expandable Form */}
                                {showAddAddressModal && (
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
                                        <h3 className="text-sm font-bold text-slate-900">Add New Shipping Address</h3>
                                        <form onSubmit={handleAddAddressSubmit} className="space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Full Name"
                                                    value={newAddress.fullName}
                                                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none"
                                                />
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="Phone Number"
                                                    value={newAddress.phone}
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Street / House / Flat / Apartment No."
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none"
                                            />
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="City"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="State"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="PIN Code"
                                                    value={newAddress.pincode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={newAddress.isDefault}
                                                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                                        className="rounded text-slate-900"
                                                    />
                                                    <span>Set as default shipping address</span>
                                                </label>

                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAddAddressModal(false)}
                                                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
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
