import React, { createContext, useContext, useReducer, useEffect, useState } from "react";

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = "ecommerce_wishlist_v1";

function wishlistReducer(state, action) {
    switch (action.type) {
        case "INIT":
            return {
                products: action.products || []
            };

        case "add": {
            const exists = state.products.some((p) => p.id === action.product.id);
            if (exists) return state;
            return {
                products: [...state.products, action.product]
            };
        }

        case "remove":
            return {
                products: state.products.filter(
                    (product) => product.id !== action.id
                )
            };

        case "clear":
            return {
                products: []
            };

        default:
            return state;
    }
}

function WishlistProvider({ children }) {
    const [state, dispatch] = useReducer(wishlistReducer, { products: [] });
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    dispatch({ type: "INIT", products: parsed });
                }
            }
        } catch (e) {
            console.error("Failed to load wishlist from localStorage", e);
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage when state changes (only after initialized)
    useEffect(() => {
        if (!isInitialized) return;
        try {
            localStorage.setItem(
                WISHLIST_STORAGE_KEY,
                JSON.stringify(state.products)
            );
        } catch (e) {
            console.error("Failed to save wishlist to localStorage", e);
        }
    }, [state.products, isInitialized]);

    const addToWishlist = (product) => {
        dispatch({ type: "add", product });
    };

    const removeFromWishlist = (id) => {
        dispatch({ type: "remove", id });
    };

    const toggleWishlist = (product) => {
        const isPresent = state.products.some((p) => p.id === product.id);
        if (isPresent) {
            removeFromWishlist(product.id);
            return false;
        } else {
            addToWishlist(product);
            return true;
        }
    };

    const isInWishlist = (id) => {
        return state.products.some((product) => product.id === id);
    };

    const clearWishlist = () => {
        dispatch({ type: "clear" });
    };

    const value = {
        state,
        dispatch,
        wishlist: state.products,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: state.products.length
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        return {
            state: { products: [] },
            wishlist: [],
            addToWishlist: () => {},
            removeFromWishlist: () => {},
            toggleWishlist: () => false,
            isInWishlist: () => false,
            clearWishlist: () => {},
            wishlistCount: 0
        };
    }
    return context;
}

export { useWishlist, WishlistProvider };