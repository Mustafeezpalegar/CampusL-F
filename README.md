# 🎒 Smart Campus Lost & Found Management System

A full-stack web application that helps students and staff report, find, and recover lost items on campus using intelligent matching and admin verification.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Multer Upload Path](#multer-upload-path)
- [Default Admin Account](#default-admin-account)
- [API Overview](#api-overview)

---

## ✨ Features

- Report lost and found items with images, location, and keywords
- Smart matching between lost and found reports
- Admin dashboard for item verification, user management, and claim review
- User dashboard with personal stats, matches, and claims
- JWT-based authentication with role-based access (user / admin)
- Image upload with Multer
- Responsive UI for mobile and desktop

---

## 🛠 Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 + Vite | UI framework and dev server |
| TanStack Query v5 | Server state management |
| React Router v7 | Client-side routing |
| Tailwind CSS | Styling |
| React Hook Form + Zod | Form validation |
| Lucide React | Icons |
| Sonner | Toast notifications |
| js-cookie | Cookie management |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcrypt | Password hashing |
| Multer | File/image upload |
| express-validator | Request validation |
| Winston | Logging |
| http-status-codes | HTTP status helpers |

---

## 📁 Project Structure

```
SmartcampusLostandFoundManagementsystem/
├── server/
│   └── src/
│       ├── claims/
│       ├── helpers/
│       ├── items/
│       │   ├── providers/
│       │   ├── validators/
│       │   └── items.schema.js
│       ├── matches/
│       ├── middleware/
│       │   ├── authenticateToken.middleware.js
│       │   ├── responseFormatter.middleware.js
│       │   └── upload.middleware.js
│       ├── seeders/
│       │   └── seedAdmin.js
│       ├── services/
│       └── users/
│           ├── providers/
│           ├── validators/
│           └── users.schema.js
│
└── client/
    ├── public/
    │   └── uploads/          ← Multer saves images here
    └── src/
        ├── components/
        │   ├── navbar/
        │   └── sidebar/
        ├── hooks/
        │   ├── itemsHook/
        │   ├── usersHook/
        │   └── claimsHook/
        ├── pages/
        │   ├── admin/
        │   └── user/
        └── schema/
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) — local or [MongoDB Atlas](https://cloud.mongodb.com/) (cloud)
- npm or yarn

---

### Backend Setup

```bash
# 1. Navigate to the server folder
cd server

# 2. Install dependencies
npm install

# 3. Create a .env file (see Environment Variables section below)
cp .env.example .env

# 4. Start the backend server
npm run dev
```

The backend will start on **http://localhost:3001**

---

### Frontend Setup

```bash
# 1. Navigate to the client folder
cd client

# 2. Install dependencies
npm install

# 3. Create a .env file
cp .env.example .env

# 4. Start the frontend dev server
npm run dev
```

The frontend will start on **http://localhost:5173**

---

## 🔑 Environment Variables

### server — `server/.env`

```env
# Server
PORT=3001

# Database
MONGO_URI=mongodb://localhost:27017/campus_lf
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campus_lf

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_ACCESS_EXPIRATION_TTL=86400       # seconds — 86400 = 24 hours

# Admin seed credentials (auto-created on first run)
ADMIN_EMAIL=admin@campus.com
ADMIN_PASSWORD=Abcd@123
ADMIN_FIRSTNAME=Campus
ADMIN_LASTNAME=Admin
```

### client — `client/.env`

```env
# Must end with a trailing slash
VITE_API_URL=http://localhost:3001/
```

---

## 📁 Multer Upload Path

User-uploaded item and profile photos are stored in Cloudinary. Configure
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` on the
backend. Uploads accept JPEG, PNG, and WebP images up to 5 MB.

## 🌐 Deploying the application

The repository is configured to deploy the React frontend to Vercel and the Express
API to Render. MongoDB Atlas stores application data and Cloudinary stores uploads.

1. Create a MongoDB Atlas cluster and database user. Add Render's outbound access
   to the Atlas network allowlist (for a public demo, Atlas allows `0.0.0.0/0`).
   Copy the cluster connection string for `DATABASE_URL`.
2. Create a Cloudinary account and note its cloud name, API key, and API secret.
3. In Render, create a new Blueprint from this GitHub repository and apply
   `render.yaml`. Set the requested environment values:
   `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_ORIGINS`, and the three
   Cloudinary credentials. Use a long, unique admin password.
4. Once Render deploys, check `https://<your-render-service>.onrender.com/health`.
   It should return `{"status":"ok"}`.
5. In Vercel, import this GitHub repository. Keep the project root at the
   repository root; `vercel.json` configures the frontend build and SPA routes.
6. Set `VITE_API_URL` in Vercel's project environment variables to the API base
   URL, including the final slash, for example
   `https://<your-render-service>.onrender.com/`. Deploy or redeploy the frontend.
7. In Render, set `CLIENT_ORIGINS` to the exact Vercel website origin, for example
   `https://<your-project>.vercel.app` (no trailing slash). Add any custom domain
   origin, comma-separated, if you use one. Save and redeploy the API.

Do not commit `.env` files or put database, JWT, admin, or Cloudinary secrets in
Vercel's `VITE_` variables; Vite exposes those variables to every browser user.
The frontend's `VITE_API_URL` is public and should contain only the API URL.

---

## 👤 Default Admin Account

When the backend starts for the first time, it automatically creates an admin
account using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. In development, the fallback
credentials are `admin@campus.com` / `Abcd@123`; production requires explicit
credentials and will not start without them.

| Field | Default Value |
|---|---|
| Email | `ADMIN_EMAIL` environment variable |
| Password | `ADMIN_PASSWORD` environment variable |
| Role | admin |

> **Set a unique, strong admin password before deploying to production.**

Login at `http://localhost:5173/login` with the admin credentials to access the admin dashboard at `/admin`.

---

## 📡 API Overview

All responses are formatted by `responseFormatter.middleware.js`:

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "OK",
  "data": { ... },
  "pagination": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
}
```

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/users/create` | Register new user |
| POST | `/login` | Login and get JWT token |

### Items
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/getitems` | ✅ | Browse approved items |
| POST | `/getmyitems` | ✅ | Current user's own items |
| POST | `/getadminitems` | 🛡 Admin | All items with filters |
| GET | `/items/:id` | ✅ | Single item details |
| POST | `/createitem` | ✅ | Report a lost/found item |
| PATCH | `/items/:id` | ✅ | Update own item |
| PATCH | `/items/:id/verify` | 🛡 Admin | Approve or reject item |
| DELETE | `/items/:id` | ✅ | Delete own item |

### Users
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/users/dashboard` | ✅ | User dashboard data |
| GET | `/users/profile` | ✅ | Get own profile |
| PATCH | `/users/profile` | ✅ | Update profile + image |
| PATCH | `/users/password` | ✅ | Change password |
| POST | `/getusers` | 🛡 Admin | List all users |
| PATCH | `/users/:id/block` | 🛡 Admin | Block or unblock user |

---

## 📝 Notes

- The `responseFormatter` middleware requires providers to send a `pagination` key (not `meta`) for pagination to work correctly.
- JWT tokens do not auto-refresh — users must log in again after expiry.
- The `seedAdmin.js` seeder runs on every server start but skips creation if the admin already exists.

---

*Built with ❤️ for campus communities · © 2026 Smart Campus Lost & Found System*