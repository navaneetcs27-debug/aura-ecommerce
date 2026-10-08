# 🎓 AURA STYLE — Complete Full-Stack E-Commerce Project Dossier

This document provides a comprehensive technical overview of the **AURA STYLE** e-commerce project for technical interview evaluation, code review, and mock interview practice.

---

## 🌟 Live Demo & Source Links
- **Live Frontend Application**: https://aura-ecommerce-puce.vercel.app
- **GitHub Repository**: https://github.com/navaneetcs27-debug/aura-ecommerce
- **Tech Stack**: Next.js (React 18), Node.js, Express, MongoDB (Mongoose), TailwindCSS, Razorpay API, Docker, Vercel, Render.

---

## 🏗️ Architecture & Component Hierarchy

### 1. Frontend (Next.js Pages Router)
- `pages/index.js`: Landing page with dynamic Hero carousel, Category showcases, Flash Deals countdown timer, and trending drops.
- `pages/search.js`: Advanced multi-filter search page (Category, Gender, Price Range slider, Rating, dynamic URL query sync).
- `pages/product/[productId].jsx`: Dynamic product detail page with high-res imagery, rating reviews, size/color selectors, and Add to Bag.
- `pages/cart.js`: Full shopping cart management with dynamic pricing calculation, promo codes, and quantity counters.
- `pages/checkout.js`: Multi-step checkout with saved address management, order summary, coupon validation, and payment trigger.
- `pages/orders/index.js` & `pages/orders/[orderId].js`: Order history and interactive visual tracking timeline (*Placed → Processing → Shipped → Delivered*).
- `pages/login.js` & `pages/register.js`: Authentication portal with 1-Click Demo Login support (Customer & Admin).
- `pages/profile.js`: User profile & delivery address book manager.
- `pages/wishlist.js`: Saved favorite items with 1-click transfer to cart.

### 2. State Management (React Context API)
- `context/cart-context.js`: Persistent shopping cart state with local storage hydration sync.
- `context/wishlist-context.js`: Persistent bookmarking and wishlist synchronization.
- `context/auth-context.js`: User authentication state, JWT decoding, login/logout, and role management.
- `context/order-context.js`: Checkout state, coupon application, and placed orders tracking.
- `context/toast-context.js`: Global non-intrusive notification system.

### 3. Backend REST APIs (`backend/`)
- `backend/server.js`: Express application entry point with CORS whitelist, route binding, and MongoDB connection.
- `backend/controllers/authController.js`: Registration, Login, JWT issuing, Password hashing with `bcryptjs`.
- `backend/controllers/productController.js`: Product filtering, sorting, pagination, and details.
- `backend/controllers/cartController.js`: Cloud-backed cart persistence per user.
- `backend/controllers/orderController.js`: Order creation, inventory validation, and status lifecycle.
- `backend/controllers/paymentController.js`: Razorpay order creation and HMAC SHA256 cryptographic signature verification.
- `backend/controllers/addressController.js`: User address CRUD management.
- `backend/controllers/adminController.js`: Admin-only statistics, order status mutations, and metrics.

### 4. Database Models (MongoDB / Mongoose)
- `backend/models/User.js`: User schema with role enum (`customer`, `admin`), password hashing hook.
- `backend/models/Product.js`: Product catalog with pricing, category, gender, ratings, stock, and images.
- `backend/models/Order.js`: Order records with items snapshot, payment status, shipping address, and tracking status.
- `backend/models/Cart.js`: Shopping cart schema linked to user ID.
- `backend/models/Address.js`: Delivery addresses with default flag.

---

## 🔑 Key Interview Talking Points

1. **Hydration Mismatch Solution**: Resolved Next.js SSR vs client `localStorage` sync issues using a `mounted` lifecycle gate.
2. **Security Implementation**: JWT stored in secure storage, bcrypt hashed passwords with salt rounds, Express auth and admin middleware guards.
3. **Payment Security**: Simulated Razorpay workflow with server-side signature verification before updating order payment status.
4. **Clean Code & Modular Design**: Segregated reusable UI components, centralized API service abstraction (`services/api.js`), and consistent design tokens in TailwindCSS.
