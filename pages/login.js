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
                <title>Sign In - AURA ATELIER</title>
            </Head>

            <div className="max-w-md mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl p-8 border border-neutral-300 shadow-md space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-black text-xl">
                            A
                        </div>
                        <h1 className="text-2xl font-black text-black tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-xs text-black font-bold mt-1">
                            Sign in to access your orders, saved items, and personalized style.
                        </p>
                    </div>

                    {/* 1-Click Demo Login Box */}
                    <div className="p-4 bg-neutral-100 border border-neutral-300 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-black text-black block">⚡ Quick Demo Login</span>
                                <span className="text-[11px] text-black font-bold">Instant access for previewing</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleDemoLogin}
                                className="px-3.5 py-1.5 bg-neutral-950 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition"
                            >
                                1-Click Sign In
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-px bg-neutral-300 flex-1" />
                        <span className="text-[11px] text-black font-black uppercase tracking-wider">Or sign in with email</span>
                        <div className="h-px bg-neutral-300 flex-1" />
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {errorMessage && (
                            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-bold">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-black text-black block mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 focus:outline-none focus:bg-white focus:border-black text-black placeholder-neutral-500 font-bold transition"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-black text-black">Password</label>
                                <button
                                    type="button"
                                    onClick={() => alert("For testing, please use Demo Login or sign up with any password.")}
                                    className="text-[11px] text-black hover:underline font-bold underline"
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
                                    className="w-full px-4 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 focus:outline-none focus:bg-white focus:border-black text-black placeholder-neutral-500 font-bold transition pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-black hover:opacity-80 font-black text-xs"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-neutral-950 hover:bg-black text-white font-black text-xs rounded-2xl shadow-md transition active:scale-98"
                        >
                            {loading ? "Signing in..." : "Sign In to Account"}
                        </button>
                    </form>

                    {/* Switch to Register */}
                    <div className="text-center pt-2 border-t border-neutral-200">
                        <p className="text-xs text-black font-bold">
                            Don&apos;t have an account yet?{' '}
                            <Link href={`/register${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}>
                                <a className="font-black text-black underline hover:opacity-80">Create Account</a>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
