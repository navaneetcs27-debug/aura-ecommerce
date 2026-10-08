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
                            <div className="min-h-screen flex flex-col bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white relative">
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