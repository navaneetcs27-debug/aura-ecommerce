import React from 'react';

export const RatingStars = ({ rating = 5, reviewCount, size = "sm", showNumber = true }) => {
    const numericRating = Number(rating) || 0;
    const roundedRating = Math.round(numericRating * 2) / 2;

    const starSizeClass = {
        xs: "w-3 h-3 text-xs",
        sm: "w-4 h-4 text-sm",
        md: "w-5 h-5 text-base",
        lg: "w-6 h-6 text-lg"
    }[size] || "w-4 h-4 text-sm";

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                // Full star
                stars.push(
                    <span key={i} className="text-amber-400">
                        ★
                    </span>
                );
            } else if (i - 0.5 === roundedRating) {
                // Half star
                stars.push(
                    <span key={i} className="text-amber-400 relative">
                        ★
                    </span>
                );
            } else {
                // Empty star
                stars.push(
                    <span key={i} className="text-slate-300">
                        ★
                    </span>
                );
            }
        }
        return stars;
    };

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            <div className={`flex items-center tracking-tight ${starSizeClass}`}>
                {renderStars()}
            </div>
            {showNumber && (
                <span className="text-xs font-black text-black ml-0.5">
                    {numericRating.toFixed(1)}
                </span>
            )}
            {reviewCount !== undefined && (
                <span className="text-xs text-black font-bold">
                    ({reviewCount})
                </span>
            )}
        </div>
    );
};

