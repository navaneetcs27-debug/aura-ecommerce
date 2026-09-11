import React from 'react';

const NumberCounter = ({ quantity = 1, updateQuantity, min = 1, max = 99, size = "md" }) => {
    const handleDecrement = (e) => {
        e.stopPropagation();
        if (quantity > min) {
            updateQuantity(quantity - 1);
        }
    };

    const handleIncrement = (e) => {
        e.stopPropagation();
        if (quantity < max) {
            updateQuantity(quantity + 1);
        }
    };

    const handleChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
            const clamped = Math.max(min, Math.min(max, val));
            updateQuantity(clamped);
        }
    };

    const isSmall = size === "sm";

    return (
        <div className={`inline-flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden shadow-sm ${isSmall ? 'h-8' : 'h-10'}`}>
            <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= min}
                className={`flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition ${
                    isSmall ? 'w-7 text-sm' : 'w-9 text-base'
                }`}
                aria-label="Decrease quantity"
            >
                −
            </button>
            <input
                type="text"
                readOnly
                value={quantity}
                onChange={handleChange}
                className={`font-semibold text-slate-900 bg-transparent text-center focus:outline-none select-none ${
                    isSmall ? 'w-8 text-xs' : 'w-10 text-sm'
                }`}
                aria-label="Item quantity"
            />
            <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= max}
                className={`flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition ${
                    isSmall ? 'w-7 text-sm' : 'w-9 text-base'
                }`}
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
};

export default NumberCounter;