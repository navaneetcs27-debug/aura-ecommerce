import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

const ORDERS_STORAGE_KEY = "ecommerce_orders_v1";

const INITIAL_SAMPLE_ORDERS = [
    {
        id: "ORD-892410",
        date: "2026-08-20T14:32:00.000Z",
        formattedDate: "August 20, 2026",
        status: "Delivered",
        estimatedDelivery: "August 23, 2026",
        shippingAddress: {
            fullName: "Alex Johnson",
            phone: "+91 98765 43210",
            street: "Flat 402, Sunshine Heights, 18th Main Rd",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001"
        },
        deliveryOption: {
            id: "standard",
            name: "Standard Delivery",
            duration: "3-5 Business Days",
            price: 0
        },
        paymentMethod: {
            type: "card",
            label: "Credit Card (ending in 4242)"
        },
        items: [
            {
                id: 1,
                title: "Beige Jogger",
                category: "Pants",
                imgUrl: "beige_jogger(men).jpg",
                price: 30,
                qt: 1
            },
            {
                id: 2,
                title: "Beige Sweater",
                category: "Sweaters",
                imgUrl: "beige_sweater(men).jpg",
                price: 78,
                qt: 1
            }
        ],
        pricing: {
            subtotal: 108,
            tax: 11,
            deliveryCharge: 0,
            discount: 0,
            grandTotal: 119
        },
        trackingTimeline: [
            { stage: "Order Placed", date: "Aug 20, 02:32 PM", completed: true, current: false },
            { stage: "Order Confirmed", date: "Aug 20, 03:00 PM", completed: true, current: false },
            { stage: "Shipped", date: "Aug 21, 10:15 AM", completed: true, current: false },
            { stage: "Out for Delivery", date: "Aug 23, 08:30 AM", completed: true, current: false },
            { stage: "Delivered", date: "Aug 23, 01:45 PM", completed: true, current: true }
        ]
    }
];

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setOrders(parsed);
                }
            } else {
                setOrders(INITIAL_SAMPLE_ORDERS);
                localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_ORDERS));
            }
        } catch (e) {
            console.error("Failed to load orders from localStorage", e);
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (!isInitialized) return;
        try {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        } catch (e) {
            console.error("Failed to save orders to localStorage", e);
        }
    }, [orders, isInitialized]);

    const placeOrder = ({ items, shippingAddress, deliveryOption, paymentMethod, pricing, user }) => {
        const orderIdNumber = Math.floor(100000 + Math.random() * 900000);
        const orderId = `ORD-${orderIdNumber}`;
        const now = new Date();
        
        // Calculate estimated delivery
        const deliveryDays = deliveryOption?.id === 'express' ? 2 : deliveryOption?.id === 'sameday' ? 0 : 4;
        const estDate = new Date(now);
        estDate.setDate(estDate.getDate() + deliveryDays);

        const newOrder = {
            id: orderId,
            date: now.toISOString(),
            formattedDate: now.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }),
            status: "Order Placed",
            estimatedDelivery: estDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }),
            shippingAddress,
            deliveryOption: deliveryOption || { name: "Standard Delivery", price: 0 },
            paymentMethod: paymentMethod || { type: "card", label: "Credit Card" },
            items: [...items],
            pricing: { ...pricing },
            customer: user ? { name: user.name, email: user.email, phone: user.phone } : null,
            trackingTimeline: [
                { stage: "Order Placed", date: "Just now", completed: true, current: true },
                { stage: "Processing", date: "Expected in 2 hours", completed: false, current: false },
                { stage: "Shipped", date: "Pending", completed: false, current: false },
                { stage: "Out for Delivery", date: "Pending", completed: false, current: false },
                { stage: "Delivered", date: `By ${estDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, completed: false, current: false }
            ]
        };

        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

        return newOrder;
    };

    const getOrder = (orderId) => {
        return orders.find((o) => o.id === orderId) || null;
    };

    const cancelOrder = (orderId) => {
        const updated = orders.map((order) => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status: "Cancelled",
                    trackingTimeline: [
                        ...order.trackingTimeline,
                        { stage: "Cancelled", date: "Just now", completed: true, current: true }
                    ]
                };
            }
            return order;
        });
        setOrders(updated);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    };

    const advanceOrderStatus = (orderId) => {
        const order = getOrder(orderId);
        if (!order || order.status === "Delivered" || order.status === "Cancelled") return;

        const stages = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
        const currentIndex = stages.indexOf(order.status);
        if (currentIndex < stages.length - 1) {
            const nextStatus = stages[currentIndex + 1];
            const updated = orders.map((o) => {
                if (o.id === orderId) {
                    const newTimeline = o.trackingTimeline.map((item, idx) => ({
                        ...item,
                        completed: idx <= currentIndex + 1,
                        current: idx === currentIndex + 1,
                        date: idx <= currentIndex + 1 && item.date.includes("Pending") ? "Updated just now" : item.date
                    }));
                    return {
                        ...o,
                        status: nextStatus,
                        trackingTimeline: newTimeline
                    };
                }
                return o;
            });
            setOrders(updated);
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const value = {
        orders,
        placeOrder,
        getOrder,
        cancelOrder,
        advanceOrderStatus,
        totalOrdersCount: orders.length
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (!context) {
        return {
            orders: [],
            placeOrder: () => ({ id: `ORD-${Date.now()}` }),
            getOrder: () => null,
            cancelOrder: () => {},
            advanceOrderStatus: () => {},
            totalOrdersCount: 0
        };
    }
    return context;
}
