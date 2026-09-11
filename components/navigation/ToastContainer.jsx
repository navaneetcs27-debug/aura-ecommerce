import React from 'react';
import { useToast } from '../../context/toast-context';

export const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (!toasts || toasts.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return (
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        ✓
                    </span>
                );
            case 'error':
                return (
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                        ✕
                    </span>
                );
            case 'info':
            default:
                return (
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
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
                    className="pointer-events-auto flex items-center justify-between p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200/80 animate-slideUp transition-all duration-300 transform hover:scale-[1.02]"
                >
                    <div className="flex items-center gap-3">
                        {getIcon(toast.type)}
                        <p className="text-sm font-medium text-slate-800">{toast.message}</p>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-3 text-slate-400 hover:text-slate-600 p-1 text-xs rounded transition"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};
