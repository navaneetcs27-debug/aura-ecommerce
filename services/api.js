const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };
    const token = typeof window !== "undefined" ? localStorage.getItem("ecommerce_auth_token") : null;

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

export const api = {
    // Auth endpoints
    login: (credentials) => request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    }),
    register: (details) => request("/auth/register", {
        method: "POST",
        body: JSON.stringify(details)
    }),
    getMe: () => request("/auth/me"),

    // Product endpoints
    getProducts: (query = "") => request(`/products${query}`),
    getProductById: (id) => request(`/products/${id}`),
    createProduct: (productData) => request("/products", {
        method: "POST",
        body: JSON.stringify(productData)
    }),

    // Cart endpoints
    getCart: () => request("/cart"),
    addToCart: (productId, quantity = 1) => request("/cart/add", {
        method: "POST",
        body: JSON.stringify({ productId, quantity })
    }),
    removeFromCart: (productId) => request(`/cart/item/${productId}`, {
        method: "DELETE"
    }),

    // Order endpoints
    checkout: (orderData) => request("/orders/checkout", {
        method: "POST",
        body: JSON.stringify(orderData)
    }),
    getMyOrders: () => request("/orders/my-orders"),
    getOrderById: (id) => request(`/orders/${id}`),

    // Address endpoints
    getAddresses: () => request("/addresses"),
    addAddress: (addressData) => request("/addresses", {
        method: "POST",
        body: JSON.stringify(addressData)
    }),
    updateAddress: (id, addressData) => request(`/addresses/${id}`, {
        method: "PUT",
        body: JSON.stringify(addressData)
    }),
    deleteAddress: (id) => request(`/addresses/${id}`, {
        method: "DELETE"
    }),
    setDefaultAddress: (id) => request(`/addresses/${id}/default`, {
        method: "PATCH"
    }),

    // Admin endpoints
    getAdminStats: () => request("/admin/stats"),
    getAdminOrders: () => request("/admin/orders"),
    updateAdminOrderStatus: (id, statusData) => request(`/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify(statusData)
    }),

    // Razorpay Payment endpoints
    getRazorpayKey: () => request("/payment/key"),
    createPaymentOrder: (data) => request("/payment/create-order", {
        method: "POST",
        body: JSON.stringify(data)
    }),
    verifyPaymentSignature: (data) => request("/payment/verify", {
        method: "POST",
        body: JSON.stringify(data)
    }),

    // Health Check
    checkHealth: () => request("/health")
};

export default api;
