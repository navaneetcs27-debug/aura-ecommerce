# 🚀 Complete Deployment Guide: AURA STYLE E-Commerce

This guide provides step-by-step instructions on how to deploy both the **Next.js Frontend** and the **Node.js Express Backend** to production using industry-standard platforms (Vercel, Render/Railway, MongoDB Atlas, and Docker/VPS).

---

## 🏗️ Architecture Overview

- **Frontend**: Next.js (React 18), TailwindCSS, Context API, Dynamic Filters, Cart & Checkout.
- **Backend**: Node.js, Express, Mongoose, JWT Authentication, RESTful APIs.
- **Database**: MongoDB Atlas (Cloud NoSQL Database).

---

## 🔑 Default Credentials & Accounts

After seeding the database or running the app:
| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Demo Customer** | `alex@example.com` | `password123` | Customer shopping, cart, wishlist, orders |
| **Admin User** | `admin@aurastyle.com` | `admin123` | Admin dashboard, inventory & order status management |

*(Or click the **1-Click Demo Login** button directly on the `/login` page)*

---

## ⚡ Option 1: Cloud Deployment (Recommended - Free & Fast)

### Step 1: Set Up MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g. `ecommerce_user` with password).
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** → **Drivers (Node.js)** and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Backend to Render.com (or Railway)
1. Push your repository to **GitHub** or **GitLab**.
2. Go to [Render.com](https://render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `PORT` | `5000` |
   | `MONGO_URI` | `your_mongodb_connection_string_from_step_1` |
   | `JWT_SECRET` | `a_long_secure_random_string_key_32_chars` |
   | `RAZORPAY_KEY_ID` | `rzp_test_your_key_id` *(from Razorpay Dashboard)* |
   | `RAZORPAY_KEY_SECRET` | `your_razorpay_secret_key` |
   | `FRONTEND_URL` | `https://your-frontend-app.vercel.app` *(or `*` during initial deploy)* |
6. Click **Create Web Service**. Once deployed, Render will provide a public URL:
   `https://your-backend-service.onrender.com`

> [!TIP]
> **Seed the Cloud Database**:
> You can seed your live MongoDB database anytime from your local machine by pointing `MONGO_URI` in `backend/.env` to your Atlas URI and running:
> ```bash
> cd backend
> npm run seed
> ```

---

### Step 3: Deploy Frontend to Vercel
1. Go to [Vercel](https://vercel.com/) and click **Add New** → **Project**.
2. Import your GitHub repository.
3. In **Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default workspace root)
4. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://your-backend-service.onrender.com/api` |
5. Click **Deploy**.
6. In ~60 seconds, your site will be live at `https://your-app.vercel.app`! 🎉

---

## 🐳 Option 2: Docker & Docker Compose Deployment

If you are deploying to an **AWS EC2, DigitalOcean Droplet, Linode, or any Linux VPS**:

### 1. Prerequisites
Install Docker and Docker Compose on your server:
```bash
sudo apt update && sudo apt install docker.io docker-compose -y
```

### 2. Configure Environment
Create a `.env` file in the project root:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Build and Run Container Stack
```bash
docker compose up -d --build
```

- Frontend will be accessible on: `http://your-server-ip:3000`
- Backend API will be accessible on: `http://your-server-ip:5000`

---

## 🖥️ Option 3: Running Locally in Development

### Terminal 1: Start Backend Server
```bash
cd backend
npm install
npm run seed     # Seeds products & users into MongoDB
npm run dev      # Runs on http://localhost:5000
```

### Terminal 2: Start Frontend Next.js App
```bash
npm install
npm run dev      # Runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔍 Verification & Health Check Endpoints

- Backend Health Check: `GET /api/health`
- Backend Product List: `GET /api/products`
- Backend Cart API: `GET /api/cart`
- Backend Addresses API: `GET /api/addresses`
- Admin Dashboard Stats: `GET /api/admin/stats`

---

## 🛡️ Best Practices & Troubleshooting

1. **CORS Errors**: Ensure `FRONTEND_URL` in the backend environment matches your live Vercel domain (e.g. `https://my-store.vercel.app`).
2. **Next.js Image Warnings**: Domains like `images.unsplash.com` are pre-configured in `next.config.js`. If you add another image host, add it to `images.domains` in `next.config.js`.
3. **Database Connection Timeouts**: Make sure your IP address whitelist in MongoDB Atlas is set to `0.0.0.0/0` (Allow from anywhere) so cloud servers like Render / Vercel can connect without blockage.
