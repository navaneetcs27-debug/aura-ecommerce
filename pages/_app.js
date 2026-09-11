import '../styles/globals.css';
import { ToastProvider } from '../context/toast-context';
import { AuthProvider } from '../context/auth-context';
import { CartProvider } from '../context/cart-context';
import { WishlistProvider } from '../context/wishlist-context';
import { OrderProvider } from '../context/order-context';
import { Header } from '../components/navigation/Header';
import { ToastContainer } from '../components/navigation/ToastContainer';

function MyApp({ Component, pageProps }) {
    return (
        <ToastProvider>
            <AuthProvider>
                <WishlistProvider>
                    <CartProvider>
                        <OrderProvider>
                            <div className="min-h-screen flex flex-col bg-canvas-light text-slate-900 selection:bg-indigo-600 selection:text-white relative overflow-hidden">
                                {/* Ambient Background Glow Orbs */}
                                <div className="fixed -top-40 -left-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />
                                <div className="fixed top-1/3 -right-40 w-[500px] h-[500px] bg-rose-400/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow" style={{ animationDelay: '2s' }} />
                                <div className="fixed -bottom-40 left-1/4 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow" style={{ animationDelay: '4s' }} />
                                
                                <Header />
                                <main className="flex-grow pt-24 pb-16 relative z-10">
                                    <Component {...pageProps} />
                                </main>
                                <ToastContainer />
                            </div>
                        </OrderProvider>
                    </CartProvider>
                </WishlistProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

export default MyApp;