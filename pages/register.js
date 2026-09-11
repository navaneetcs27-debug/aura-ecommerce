import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        street: '',
        city: '',
        state: 'Maharashtra',
        pincode: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const redirectPath = router.query.redirect || '/';

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (form.password.length < 4) {
            setErrorMessage("Password must be at least 4 characters long.");
            return;
        }

        setLoading(true);
        const res = await register(form);
        setLoading(false);

        if (res.success) {
            showToast(`Account created! Welcome, ${res.user.name.split(' ')[0]} 🎉`, "success");
            router.push(redirectPath);
        } else {
            setErrorMessage(res.message);
            showToast(res.message, "error");
        }
    };

    return (
        <>
            <Head>
                <title>Create Account - AURA STYLE</title>
            </Head>

            <div className="max-w-lg mx-auto px-4 py-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6">
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                            A
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Create Your Account
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Join AURA STYLE for seamless checkout, order tracking, and exclusive discounts.
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {errorMessage && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
                                {errorMessage}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. John Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                                Password *
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="At least 4 characters"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400"
                            />
                        </div>

                        {/* Optional initial address */}
                        <div className="pt-2 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                Default Delivery Address (Optional)
                            </span>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Street / House / Apartment No."
                                    value={form.street}
                                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                                    className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                        className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="PIN Code"
                                        value={form.pincode}
                                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                                        className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-98"
                        >
                            {loading ? "Creating Account..." : "Create Free Account"}
                        </button>
                    </form>

                    <div className="text-center pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500">
                            Already have an account?{' '}
                            <Link href={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}>
                                <a className="font-bold text-slate-900 hover:underline">Sign In</a>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
