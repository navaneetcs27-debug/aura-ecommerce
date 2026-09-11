import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from "react";
import { validateCoupon } from "../data/coupons";

const CartContext = createContext();

const CART_STORAGE_KEY = "ecommerce_cart_v1";

function cartReducer(state, action) {
    switch (action.type) {
        case "INIT":
            return {
                ...state,
                products: action.products || []
            };

        case "add": {
            const quantityToAdd = action.product.qt || 1;
            const existingIndex = state.products.findIndex(
                (p) => p.id === action.product.id
            );

            if (existingIndex > -1) {
                const updatedProducts = [...state.products];
                const current = updatedProducts[existingIndex];
                updatedProducts[existingIndex] = {
                    ...current,
                    qt: (current.qt || 1) + quantityToAdd
                };
                return { ...state, products: updatedProducts };
            } else {
                return {
                    ...state,
                    products: [
                        ...state.products,
                        { ...action.product, qt: quantityToAdd }
                    ]
                };
            }
        }

        case "remove":
            return {
                ...state,
                products: state.products.filter((product) => product.id !== action.id)
            };

        case "updateAmount": {
            if (action.quantity <= 0) {
                return {
                    ...state,
                    products: state.products.filter((p) => p.id !== action.id)
                };
            }
            return {
                ...state,
                products: state.products.map((product) =>
                    product.id === action.id
                        ? { ...product, qt: Math.max(1, action.quantity) }
                        : product
                )
            };
        }

        case "clear":
            return {
                ...state,
                products: [],
                coupon: null
            };

        case "setCoupon":
            return {
                ...state,
                coupon: action.coupon
            };

        case "removeCoupon":
            return {
                ...state,
                coupon: null
            };

        default:
            return state;
    }
}

function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, {
        products: [],
        coupon: null
    });
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    dispatch({ type: "INIT", products: parsed });
                }
            }
        } catch (e) {
            console.error("Failed to load cart from localStorage", e);
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (!isInitialized) return;
        try {
            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(state.products)
            );
        } catch (e) {
            console.error("Failed to save cart to localStorage", e);
        }
    }, [state.products, isInitialized]);

    // Financial calculations
    const calculations = useMemo(() => {
        const subtotal = state.products.reduce((acc, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.qt) || 1;
            return acc + price * quantity;
        }, 0);

        const totalItemsCount = state.products.reduce(
            (acc, item) => acc + (Number(item.qt) || 1),
            0
        );

        // Tax: 10% on subtotal
        const tax = Math.round(subtotal * 0.1);

        // Standard delivery threshold: Free above ₹500, else ₹40
        let deliveryCharge = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;

        let discount = 0;
        if (state.coupon) {
            const result = validateCoupon(state.coupon.code, subtotal);
            if (result.valid) {
                discount = result.discount || 0;
                if (result.isFreeShipping) {
                    deliveryCharge = 0;
                }
            }
        }

        const grandTotal = Math.max(0, subtotal + tax + deliveryCharge - discount);
        const freeDeliveryThreshold = 500;
        const amountNeededForFreeDelivery = Math.max(
            0,
            freeDeliveryThreshold - subtotal
        );

        return {
            subtotal,
            tax,
            deliveryCharge,
            discount,
            grandTotal,
            totalItemsCount,
            amountNeededForFreeDelivery,
            freeDeliveryThreshold
        };
    }, [state.products, state.coupon]);

    const addToCart = (product, quantity = 1) => {
        dispatch({
            type: "add",
            product: { ...product, qt: quantity }
        });
    };

    const removeFromCart = (id) => {
        dispatch({ type: "remove", id });
    };

    const updateQuantity = (id, quantity) => {
        dispatch({ type: "updateAmount", id, quantity });
    };

    const clearCart = () => {
        dispatch({ type: "clear" });
    };

    const applyCouponCode = (code) => {
        const result = validateCoupon(code, calculations.subtotal);
        if (result.valid) {
            dispatch({ type: "setCoupon", coupon: result.coupon });
        }
        return result;
    };

    const removeCouponCode = () => {
        dispatch({ type: "removeCoupon" });
    };

    const value = {
        state,
        dispatch,
        cart: state.products,
        appliedCoupon: state.coupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCouponCode,
        removeCouponCode,
        ...calculations
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        return {
            state: { products: [], coupon: null },
            cart: [],
            appliedCoupon: null,
            subtotal: 0,
            tax: 0,
            deliveryCharge: 0,
            discount: 0,
            grandTotal: 0,
            totalItemsCount: 0,
            amountNeededForFreeDelivery: 500,
            freeDeliveryThreshold: 500,
            addToCart: () => {},
            removeFromCart: () => {},
            updateQuantity: () => {},
            clearCart: () => {},
            applyCouponCode: () => ({ valid: false, message: "" }),
            removeCouponCode: () => {}
        };
    }
    return context;
}

export { useCart, CartProvider };