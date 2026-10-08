import { useState, useEffect } from 'react';

export default function RazorpayModal({
    isOpen,
    onClose,
    amount,
    itemCount = 1,
    customerDetails = {},
    onPaymentSuccess
}) {
    const [selectedTab, setSelectedTab] = useState('upi');
    const [upiApp, setUpiApp] = useState('gpay');
    const [customUpiId, setCustomUpiId] = useState('customer@okhdfcbank');
    
    // Card State
    const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
    const [cardExpiry, setCardExpiry] = useState('08/28');
    const [cardCvv, setCardCvv] = useState('888');
    const [cardName, setCardName] = useState(customerDetails?.name || 'ALEX JOHNSON');

    // NetBanking State
    const [selectedBank, setSelectedBank] = useState('HDFC');

    // Processing Flow State
    const [processingStep, setProcessingStep] = useState(null); // 'connecting' | 'verifying' | 'success' | null
    const [processingMessage, setProcessingMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setProcessingStep(null);
            setProcessingMessage('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAutoFillTestCard = () => {
        setCardNumber('4242 4242 4242 4242');
        setCardExpiry('12/28');
        setCardCvv('789');
        setCardName(customerDetails?.name || 'ALEX JOHNSON');
    };

    const handleExecutePayment = (methodName = 'UPI - Google Pay') => {
        setProcessingStep('connecting');
        setProcessingMessage('Connecting to Razorpay Secure Gateway...');

        setTimeout(() => {
            setProcessingStep('verifying');
            setProcessingMessage('Authorizing 3D-Secure Transaction...');

            setTimeout(() => {
                setProcessingStep('success');
                setProcessingMessage('Payment Authorized & Captured Successfully! ✓');

                const generatedPaymentId = `pay_rzp_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
                const generatedOrderId = `order_rzp_${Math.random().toString(36).substring(2, 9)}`;

                setTimeout(() => {
                    if (onPaymentSuccess) {
                        onPaymentSuccess({
                            razorpay_payment_id: generatedPaymentId,
                            razorpay_order_id: generatedOrderId,
                            razorpay_signature: `sig_${Math.random().toString(36).substring(2, 14)}`,
                            method: methodName,
                            amount: amount
                        });
                    }
                }, 800);
            }, 1000);
        }, 900);
    };

    const bankOptions = [
        { id: 'HDFC', name: 'HDFC Bank', code: 'HDFC', color: 'from-blue-700 to-blue-900' },
        { id: 'ICICI', name: 'ICICI Bank', code: 'ICIC', color: 'from-orange-700 to-red-800' },
        { id: 'SBI', name: 'State Bank of India', code: 'SBIN', color: 'from-sky-700 to-blue-800' },
        { id: 'AXIS', name: 'Axis Bank', code: 'UTIB', color: 'from-rose-800 to-red-950' },
        { id: 'KOTAK', name: 'Kotak Mahindra', code: 'KKBK', color: 'from-red-600 to-rose-900' },
        { id: 'PNB', name: 'Punjab National Bank', code: 'PUNB', color: 'from-amber-600 to-amber-900' }
    ];

    const upiApps = [
        { id: 'gpay', name: 'Google Pay', icon: '⚡', color: 'text-blue-600' },
        { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'text-purple-600' },
        { id: 'paytm', name: 'Paytm UPI', icon: '🔷', color: 'text-cyan-600' },
        { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳', color: 'text-emerald-600' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
            {/* Modal Container */}
            <div 
                className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-300 overflow-hidden flex flex-col relative transform transition-all animate-scaleUp"
                style={{ maxHeight: '92vh' }}
            >
                {/* Header with Razorpay Branding */}
                <div className="bg-neutral-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-inner">
                            R
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black tracking-tight text-white">Razorpay Secure Checkout</h3>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 uppercase">
                                    Test Sandbox
                                </span>
                            </div>
                            <p className="text-[10px] text-neutral-300 font-medium">Merchant: <strong className="text-white font-bold">AURA ATELIER Studio</strong> • {itemCount} items</p>
                        </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                        <div>
                            <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider block">Payable</span>
                            <span className="text-base sm:text-lg font-black text-amber-400">₹{amount}</span>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processingStep !== null}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white flex items-center justify-center transition disabled:opacity-40"
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Processing Screen Overlay */}
                {processingStep && (
                    <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-white min-h-[380px] space-y-6">
                        {processingStep === 'connecting' && (
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-900">
                                    ⚡
                                </div>
                            </div>
                        )}

                        {processingStep === 'verifying' && (
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-700">
                                    🔒
                                </div>
                            </div>
                        )}

                        {processingStep === 'success' && (
                            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl font-black animate-bounce shadow-md border border-emerald-300">
                                ✓
                            </div>
                        )}

                        <div className="space-y-2 max-w-sm">
                            <h4 className="text-base font-black text-neutral-950">
                                {processingStep === 'success' ? 'Payment Approved!' : 'Processing Payment...'}
                            </h4>
                            <p className="text-xs text-neutral-800 font-bold leading-relaxed">
                                {processingMessage}
                            </p>
                            <p className="text-[10px] text-neutral-700 pt-1 font-mono font-bold">
                                256-Bit SSL Encrypted • PCI-DSS Certified
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Modal Body */}
                {!processingStep && (
                    <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
                        {/* Sidebar Navigation */}
                        <div className="w-full sm:w-48 bg-neutral-100 border-b sm:border-b-0 sm:border-r border-neutral-300 p-2 sm:p-3 flex sm:flex-col gap-1 overflow-x-auto">
                            {[
                                { id: 'upi', label: 'UPI & QR Code', icon: '⚡', badge: 'Instant' },
                                { id: 'card', label: 'Cards (Debit/Credit)', icon: '💳' },
                                { id: 'netbanking', label: 'NetBanking', icon: '🏦' },
                                { id: 'instant', label: '1-Click Fast Pay', icon: '🚀', badge: 'Fast' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between whitespace-nowrap sm:whitespace-normal gap-2 ${
                                        selectedTab === tab.id
                                            ? 'bg-neutral-950 text-white shadow-sm'
                                            : 'text-neutral-800 hover:bg-neutral-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </div>
                                    {tab.badge && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black ${
                                            selectedTab === tab.id ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-300 text-neutral-900'
                                        }`}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[460px] space-y-5 bg-white">
                            
                            {/* TAB 1: UPI & QR */}
                            {selectedTab === 'upi' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wider">Select UPI App</h4>
                                        <span className="text-[10px] text-emerald-900 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">0% Fee</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        {upiApps.map((app) => (
                                            <button
                                                key={app.id}
                                                type="button"
                                                onClick={() => setUpiApp(app.id)}
                                                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                                                    upiApp === app.id
                                                        ? 'bg-neutral-100 border-neutral-950 ring-1 ring-neutral-950 text-neutral-950'
                                                        : 'bg-white border-neutral-300 hover:border-neutral-400 text-neutral-800'
                                                }`}
                                            >
                                                <span className="text-lg">{app.icon}</span>
                                                <div>
                                                    <p className="text-xs font-bold text-neutral-950">{app.name}</p>
                                                    <p className="text-[10px] text-neutral-700 font-semibold">1-Tap Auth</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* QR Code Section */}
                                    <div className="p-3.5 bg-neutral-100 rounded-2xl border border-neutral-300 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-neutral-950 rounded-xl flex flex-col items-center justify-center text-white text-[9px] font-mono p-1 shadow-xs flex-shrink-0 text-center leading-tight">
                                            <span>[⚡ QR]</span>
                                            <span className="text-[7px] text-neutral-300 mt-1 font-bold">SCAN & PAY</span>
                                        </div>
                                        <div className="text-xs text-neutral-800 space-y-1">
                                            <p className="font-black text-neutral-950">Scan QR Code using any UPI App</p>
                                            <p className="text-[11px] text-neutral-700 font-semibold">Google Pay, PhonePe, Paytm, CRED or BHIM</p>
                                        </div>
                                    </div>

                                    {/* Custom UPI Input */}
                                    <div>
                                        <label className="text-[11px] font-bold text-neutral-900 block mb-1">Enter UPI VPA / ID</label>
                                        <input
                                            type="text"
                                            value={customUpiId}
                                            onChange={(e) => setCustomUpiId(e.target.value)}
                                            placeholder="yourname@okhdfcbank"
                                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-950 text-neutral-950 font-mono font-semibold"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleExecutePayment(`UPI (${upiApps.find(a => a.id === upiApp)?.name || 'Custom'})`)}
                                        className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2"
                                    >
                                        <span>Pay ₹{amount} via UPI ⚡</span>
                                    </button>
                                </div>
                            )}

                            {/* TAB 2: CARDS */}
                            {selectedTab === 'card' && (
                                <div className="space-y-4">
                                    {/* Card Visual Preview */}
                                    <div className="p-4 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-2xl shadow-md relative overflow-hidden border border-neutral-800">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] tracking-widest font-black text-neutral-300 uppercase">AURA Atelier Sandbox Card</span>
                                            <span className="text-base font-black italic">VISA</span>
                                        </div>
                                        <p className="font-mono text-sm tracking-widest text-white mb-3 font-bold">{cardNumber}</p>
                                        <div className="flex justify-between items-end text-[10px]">
                                            <div>
                                                <span className="text-neutral-300 block text-[8px] font-bold uppercase">Cardholder</span>
                                                <span className="font-bold tracking-wide text-white">{cardName}</span>
                                            </div>
                                            <div>
                                                <span className="text-neutral-300 block text-[8px] font-bold uppercase">Expires</span>
                                                <span className="font-bold text-white">{cardExpiry}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-neutral-900">Enter Card Information</span>
                                        <button
                                            type="button"
                                            onClick={handleAutoFillTestCard}
                                            className="text-[10px] font-black text-neutral-950 hover:underline"
                                        >
                                            ⚡ Auto-fill Test Card
                                        </button>
                                    </div>

                                    <div className="space-y-2.5">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            placeholder="4242 •••• •••• 4242"
                                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-950 text-neutral-950 font-mono font-semibold"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(e.target.value)}
                                                placeholder="MM/YY"
                                                className="px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-950 text-neutral-950 font-semibold"
                                            />
                                            <input
                                                type="password"
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value)}
                                                placeholder="CVV"
                                                maxLength={4}
                                                className="px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-950 text-neutral-950 font-semibold"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleExecutePayment(`Card ending ${cardNumber.slice(-4)}`)}
                                        className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2"
                                    >
                                        <span>Authorize & Pay ₹{amount} 💳</span>
                                    </button>
                                </div>
                            )}

                            {/* TAB 3: NETBANKING */}
                            {selectedTab === 'netbanking' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wider">Select Your Bank</h4>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {bankOptions.map((b) => (
                                            <button
                                                key={b.id}
                                                type="button"
                                                onClick={() => setSelectedBank(b.id)}
                                                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                                                    selectedBank === b.id
                                                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                                                        : 'bg-neutral-50 text-neutral-800 border-neutral-300 hover:bg-neutral-100'
                                                }`}
                                            >
                                                <span className="font-black text-xs">{b.code}</span>
                                                <span className="text-[10px] font-bold truncate w-full">{b.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900 font-semibold">
                                        ℹ️ You will be redirected to simulated secure NetBanking portal for {bankOptions.find(b => b.id === selectedBank)?.name}.
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleExecutePayment(`NetBanking (${selectedBank})`)}
                                        className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2"
                                    >
                                        <span>Proceed with {selectedBank} (₹{amount}) 🏦</span>
                                    </button>
                                </div>
                            )}

                            {/* TAB 4: 1-CLICK FAST PAY */}
                            {selectedTab === 'instant' && (
                                <div className="space-y-4 text-center py-2">
                                    <div className="w-14 h-14 mx-auto rounded-3xl bg-neutral-950 text-white flex items-center justify-center text-2xl font-black shadow-xs">
                                        ⚡
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-neutral-950">Instant Sandbox Test Payment</h4>
                                        <p className="text-xs text-neutral-800 font-medium mt-1 max-w-xs mx-auto">
                                            Bypass manual card/UPI entries and simulate instant 100% verified Razorpay transaction.
                                        </p>
                                    </div>

                                    <div className="p-3 bg-neutral-100 rounded-2xl border border-neutral-300 text-[11px] text-neutral-800 flex justify-between font-mono">
                                        <span className="font-bold">Order Total:</span>
                                        <strong className="text-neutral-950 font-black text-sm">₹{amount}</strong>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleExecutePayment('Razorpay Fast Test')}
                                        className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2"
                                    >
                                        <span>✓ 1-Click Complete Payment (₹{amount})</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Modal Footer Trust Bar */}
                <div className="bg-neutral-100 px-6 py-2.5 border-t border-neutral-300 flex items-center justify-between text-[10px] text-neutral-700 font-bold">
                    <div className="flex items-center gap-2">
                        <span>🔒 256-Bit SSL Encrypted</span>
                        <span>•</span>
                        <span>RBI Authorized</span>
                    </div>
                    <div className="font-mono text-neutral-600">
                        Razorpay Gateway v2.4
                    </div>
                </div>
            </div>
        </div>
    );
}
