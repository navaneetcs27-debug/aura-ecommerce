import React from 'react';

export const OrderStatusTracker = ({ timeline = [], currentStatus = "Order Placed" }) => {
    const defaultStages = [
        { label: "Order Placed", icon: "📝" },
        { label: "Processing", icon: "⚙️" },
        { label: "Shipped", icon: "🚚" },
        { label: "Out for Delivery", icon: "📦" },
        { label: "Delivered", icon: "🎉" }
    ];

    const getStageState = (stageLabel, index) => {
        if (currentStatus === "Cancelled") {
            return index === 0 ? "completed" : "cancelled";
        }

        const stagesList = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
        const currentIndex = stagesList.indexOf(currentStatus);

        if (currentIndex === -1) {
            // Check if matches
            if (currentStatus.toLowerCase().includes("placed")) return index <= 0 ? (index === 0 ? "current" : "pending") : "pending";
            if (currentStatus.toLowerCase().includes("delivered")) return "completed";
            return "pending";
        }

        if (index < currentIndex) return "completed";
        if (index === currentIndex) return "current";
        return "pending";
    };

    return (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between">
                {/* Progress bar background line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                
                {/* Progress bar filled line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                        width:
                            currentStatus === "Cancelled"
                                ? "0%"
                                : currentStatus === "Delivered"
                                ? "100%"
                                : currentStatus === "Out for Delivery"
                                ? "75%"
                                : currentStatus === "Shipped"
                                ? "50%"
                                : currentStatus === "Processing"
                                ? "25%"
                                : "5%"
                    }}
                />

                {/* Stages */}
                {defaultStages.map((stage, idx) => {
                    const state = getStageState(stage.label, idx);
                    const matchingTimelineItem = timeline.find((t) => t.stage.toLowerCase() === stage.label.toLowerCase());

                    return (
                        <div key={idx} className="relative z-10 flex flex-col items-center group">
                            {/* Circle Indicator */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 ${
                                    state === "completed"
                                        ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                                        : state === "current"
                                        ? "bg-slate-900 text-white ring-4 ring-slate-200 animate-pulse scale-110"
                                        : state === "cancelled"
                                        ? "bg-rose-100 text-rose-500 border border-rose-300"
                                        : "bg-white text-slate-400 border-2 border-slate-300"
                                }`}
                            >
                                {state === "completed" ? "✓" : stage.icon}
                            </div>

                            {/* Stage Label */}
                            <div className="text-center mt-2">
                                <p
                                    className={`text-xs font-bold leading-tight ${
                                        state === "completed"
                                            ? "text-emerald-700"
                                            : state === "current"
                                            ? "text-slate-900"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {stage.label}
                                </p>
                                {matchingTimelineItem && matchingTimelineItem.date && (
                                    <p className="text-[10px] text-slate-400 mt-0.5 max-w-[80px] truncate">
                                        {matchingTimelineItem.date}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
