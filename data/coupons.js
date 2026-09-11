export const AVAILABLE_COUPONS = [
    {
        code: "WELCOME20",
        discountPercent: 20,
        description: "20% off on your order",
        minOrder: 0,
        badge: "20% OFF"
    },
    {
        code: "FLAT50",
        discountAmount: 50,
        description: "Flat ₹50 off on orders above ₹200",
        minOrder: 200,
        badge: "₹50 OFF"
    },
    {
        code: "FREESHIP",
        isFreeShipping: true,
        description: "Free delivery on all orders",
        minOrder: 0,
        badge: "FREE SHIPPING"
    },
    {
        code: "SUPER500",
        discountAmount: 500,
        description: "Flat ₹500 off on luxury orders above ₹2000",
        minOrder: 2000,
        badge: "₹500 OFF"
    }
];

export function validateCoupon(code, subtotal) {
    if (!code) return { valid: false, message: "Please enter a coupon code" };
    
    const formattedCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find(c => c.code === formattedCode);
    
    if (!coupon) {
        return { valid: false, message: "Invalid coupon code" };
    }
    
    if (coupon.minOrder && subtotal < coupon.minOrder) {
        return { 
            valid: false, 
            message: `Minimum order value of ₹${coupon.minOrder} required for coupon ${coupon.code}` 
        };
    }
    
    let discount = 0;
    if (coupon.discountPercent) {
        discount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
        discount = Math.min(coupon.discountAmount, subtotal);
    }
    
    return {
        valid: true,
        coupon,
        discount,
        isFreeShipping: !!coupon.isFreeShipping,
        message: `Coupon "${coupon.code}" applied successfully!`
    };
}
