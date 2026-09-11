import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const AUTH_USER_KEY = "ecommerce_auth_user_v1";
const SAVED_ADDRESSES_KEY = "ecommerce_saved_addresses_v1";
const AUTH_TOKEN_KEY = "ecommerce_auth_token";

const DEFAULT_DEMO_USER = {
    id: "user_demo_101",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    joinedDate: "January 2024",
    bio: "Fashion enthusiast & conscious buyer"
};

const DEFAULT_ADDRESSES = [
    {
        id: "addr_1",
        fullName: "Alex Johnson",
        phone: "+91 98765 43210",
        street: "Flat 402, Sunshine Heights, 18th Main Rd",
        landmark: "Near Metro Station",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        tag: "Home",
        isDefault: true
    },
    {
        id: "addr_2",
        fullName: "Alex Johnson",
        phone: "+91 98765 43210",
        street: "Tech Park Phase 2, Tower B, Level 6",
        landmark: "Opposite Cyber City",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400051",
        tag: "Work",
        isDefault: false
    }
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState(DEFAULT_ADDRESSES);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize from localStorage and API
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem(AUTH_TOKEN_KEY);
                if (token) {
                    const response = await api.getMe();
                    if (response.user) {
                        setUser(response.user);
                    }

                    // Try to fetch user's saved addresses from server
                    try {
                        const addrRes = await api.getAddresses();
                        if (addrRes.addresses && addrRes.addresses.length > 0) {
                            const formatted = addrRes.addresses.map((a) => ({
                                id: a._id || a.id,
                                ...a
                            }));
                            setSavedAddresses(formatted);
                            localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(formatted));
                            return;
                        }
                    } catch (e) {
                        // fallback to local stored addresses
                    }
                }

                const storedAddresses = localStorage.getItem(SAVED_ADDRESSES_KEY);
                if (storedAddresses) {
                    setSavedAddresses(JSON.parse(storedAddresses));
                } else {
                    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(DEFAULT_ADDRESSES));
                }
            } catch (e) {
                localStorage.removeItem(AUTH_TOKEN_KEY);
                localStorage.removeItem(AUTH_USER_KEY);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        if (!email || !password) {
            return { success: false, message: "Email and password are required." };
        }

        try {
            const response = await api.login({ email, password });
            localStorage.setItem(AUTH_TOKEN_KEY, response.token);
            setUser(response.user);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

            // Sync addresses after login
            try {
                const addrRes = await api.getAddresses();
                if (addrRes.addresses && addrRes.addresses.length > 0) {
                    const formatted = addrRes.addresses.map((a) => ({
                        id: a._id || a.id,
                        ...a
                    }));
                    setSavedAddresses(formatted);
                    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(formatted));
                }
            } catch (e) {
                // Keep existing addresses if fetch fails
            }

            return response;
        } catch (e) {
            return { success: false, message: e.message };
        }
    };

    const loginAsDemo = () => {
        setUser(DEFAULT_DEMO_USER);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
        return { success: true, user: DEFAULT_DEMO_USER };
    };

    const register = async ({ name, email, password, phone, street, city, state, pincode }) => {
        if (!name || !email || !password) {
            return { success: false, message: "Name, email and password are required." };
        }

        try {
            const response = await api.register({ name, email, password });
            const newUser = { ...response.user, phone: phone || "" };
            localStorage.setItem(AUTH_TOKEN_KEY, response.token);

            // If an address was provided during registration, save it
            if (street && city && pincode) {
                const newAddr = {
                    id: `addr_${Date.now()}`,
                    fullName: name,
                    phone: phone || "+91 98765 00000",
                    street,
                    landmark: "",
                    city,
                    state: state || "Maharashtra",
                    pincode,
                    tag: "Home",
                    isDefault: true
                };
                const updatedAddresses = [newAddr, ...savedAddresses.map((a) => ({ ...a, isDefault: false }))];
                setSavedAddresses(updatedAddresses);
                localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updatedAddresses));

                // Also persist to backend
                api.addAddress(newAddr).catch(() => {});
            }

            setUser(newUser);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

            return { ...response, user: newUser };
        } catch (e) {
            return { success: false, message: e.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
    };

    const updateProfile = (updatedFields) => {
        if (!user) return;
        const updated = { ...user, ...updatedFields };
        setUser(updated);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
        return updated;
    };

    const addAddress = async (address) => {
        const newAddress = {
            id: `addr_${Date.now()}`,
            ...address,
            isDefault: savedAddresses.length === 0 || Boolean(address.isDefault)
        };

        let updated = [];
        if (newAddress.isDefault) {
            updated = [newAddress, ...savedAddresses.map((a) => ({ ...a, isDefault: false }))];
        } else {
            updated = [newAddress, ...savedAddresses];
        }

        setSavedAddresses(updated);
        localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));

        // Sync with API if user is authenticated with token
        const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
        if (token) {
            try {
                const res = await api.addAddress(address);
                if (res.address) {
                    newAddress.id = res.address._id || newAddress.id;
                }
            } catch (e) {
                // Address saved locally
            }
        }

        return newAddress;
    };

    const updateAddress = async (id, updatedFields) => {
        const updated = savedAddresses.map((addr) => {
            if (addr.id === id || addr._id === id) {
                return { ...addr, ...updatedFields };
            }
            if (updatedFields.isDefault) {
                return { ...addr, isDefault: false };
            }
            return addr;
        });

        setSavedAddresses(updated);
        localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));

        const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
        if (token && id && !id.startsWith("addr_")) {
            try {
                await api.updateAddress(id, updatedFields);
            } catch (e) {
                // fallback handled
            }
        }
    };

    const removeAddress = async (id) => {
        const updated = savedAddresses.filter((a) => a.id !== id && a._id !== id);
        if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
            updated[0].isDefault = true;
        }
        setSavedAddresses(updated);
        localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));

        const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
        if (token && id && !id.startsWith("addr_")) {
            try {
                await api.deleteAddress(id);
            } catch (e) {
                // fallback handled
            }
        }
    };

    const setDefaultAddress = async (id) => {
        const updated = savedAddresses.map((a) => ({
            ...a,
            isDefault: a.id === id || a._id === id
        }));
        setSavedAddresses(updated);
        localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));

        const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
        if (token && id && !id.startsWith("addr_")) {
            try {
                await api.setDefaultAddress(id);
            } catch (e) {
                // fallback handled
            }
        }
    };

    const defaultAddress = savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null;

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        savedAddresses,
        defaultAddress,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
