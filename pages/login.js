import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';

export default function LoginPage() {
    const router = useRouter();
    const { login, loginAsDemo, isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const redirectPath = router.query.redirect || '/';

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        const res = await login(email, password);
        setLoading(false);

        if (res.success) {
            showToast(`Welcome back, ${res.user.name.split(' ')[0]}! 👋`, "success");
            router.push(redirectPath);
        } else {
            setErrorMessage(res.message);
            showToast(res.message, "error");
        }
    };

    const handleDemoLogin = () => {
        const res = loginAsDemo();
        if (res.success) {
            showToast("Logged in as Demo User (Alex Johnson)! 🎉", "success");
            router.push(redirectPath);
        }
    };

    return (
        <>
            <Head>
                <title>Sign In - AURA STYLE</title>
            </Head>

            <div className="max-w-md mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                            A
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Sign in to access your orders, saved items, and personalized style.
                        </p>
                    </div>

                    {/* 1-Click Demo Login Box */}
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-indigo-900 block">⚡ Quick Demo Login</span>
                                <span className="text-[11px] text-indigo-600">Instant access for previewing</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleDemoLogin}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                            >
                                1-Click Sign In
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-px bg-slate-200 flex-1" />
                        <span className="text-[11px] text-slate-400 font-semibold uppercase">Or sign in with email</span>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {errorMessage && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400 transition"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-slate-700">Password</label>
                                <button
                                    type="button"
                                    onClick={() => alert("For testing, please use Demo Login or sign up with any password.")}
                                    className="text-[11px] text-slate-500 hover:text-slate-900 underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400 transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-98"
                        >
                            {loading ? "Signing in..." : "Sign In to Account"}
                        </button>
                    </form>

                    {/* Switch to Register */}
                    <div className="text-center pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500">
                            Don&apos;t have an account yet?{' '}
                            <Link href={`/register${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}>
                                <a className="font-bold text-slate-900 hover:underline">Create Account</a>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
