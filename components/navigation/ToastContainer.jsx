import React from 'react';
import { useToast } from '../../context/toast-context';

export const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (!toasts || toasts.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return (
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center font-black text-xs">
                        ✓
                    </span>
                );
            case 'error':
                return (
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-900 border border-rose-300 flex items-center justify-center font-black text-xs">
                        ✕
                    </span>
                );
            case 'info':
            default:
                return (
                    <span className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-950 border border-neutral-300 flex items-center justify-center font-black text-xs">
                        ℹ
                    </span>
                );
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="pointer-events-auto flex items-center justify-between p-4 bg-white rounded-2xl shadow-2xl border border-neutral-300 animate-slideUp transition-all duration-300 transform hover:scale-[1.02]"
                >
                    <div className="flex items-center gap-3">
                        {getIcon(toast.type)}
                        <p className="text-xs font-black text-black leading-snug">{toast.message}</p>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-3 text-black hover:opacity-75 font-black p-1 text-xs rounded transition"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};
