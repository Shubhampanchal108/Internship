# 📝 Blog System with Users — GOW AI Academy Day 2

A production-ready Blog System REST API built with **Node.js**, **Express**, and **MongoDB** following industry-level architecture patterns.

---

## 🏗️ Folder Structure

```
blog-system/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection with reconnect logic
│   │   └── constants.js         # App-wide constants (roles, status, pagination)
│   │
│   ├── controllers/             # Request/Response layer (thin — no business logic)
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   └── comment.controller.js
│   │
│   ├── services/                # Business logic layer
│   │   ├── auth.service.js      # JWT, register, login, refresh, logout
│   │   ├── user.service.js      # User CRUD, password change
│   │   ├── post.service.js      # Post CRUD, feed, user posts
│   │   └── comment.service.js   # Comment CRUD, nested replies
│   │
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js              # With bcrypt hooks, virtuals, safe serialization
│   │   ├── Post.js              # With slug generation, full-text index
│   │   └── Comment.js           # Nested replies, auto commentsCount sync
│   │
│   ├── routes/                  # Express routers
│   │   ├── index.js             # Mounts all route groups
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── post.routes.js       # Includes nested comment routes
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT protect, optionalAuth, restrictTo, adminOnly
│   │   └── errorHandler.js      # Centralized error handler (dev vs prod)
│   │
│   ├── validators/
│   │   └── schemas.js           # Joi validation schemas + validate() middleware
│   │
│   ├── utils/
│   │   ├── logger.js            # Winston logger (file + console)
│   │   ├── AppError.js          # Custom operational error class
│   │   ├── apiResponse.js       # Standardized JSON response helpers
│   │   └── pagination.js        # Reusable pagination utilities
│   │
│   ├── app.js                   # Express app (middleware, routes, error handler)
│   └── server.js                # Entry point (DB connect, graceful shutdown)
│
├── logs/                        # Auto-created: error.log, combined.log
├── .env.example                 # Environment variable template
├── .gitignore
└── package.json
```

---

## 🚀 Quick Start

```bash
# 1. Clone and install
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets

# 3. Start development server
npm run dev

# 4. Start production server
npm start
```

---

## 🔌 API Endpoints

### Auth  `/api/v1/auth`
| Method | Endpoint          | Auth | Description          |
|--------|-------------------|------|----------------------|
| POST   | `/register`       | ❌   | Register new user    |
| POST   | `/login`          | ❌   | Login, get tokens    |
| POST   | `/refresh-token`  | ❌   | Refresh access token |
| GET    | `/me`             | ✅   | Get current user     |
| POST   | `/logout`         | ✅   | Logout               |

### Users  `/api/v1/users`
| Method | Endpoint            | Auth  | Description         |
|--------|---------------------|-------|---------------------|
| GET    | `/`                 | Admin | List all users      |
| GET    | `/:id`              | ✅    | Get user profile    |
| PATCH  | `/update-profile`   | ✅    | Update own profile  |
| PATCH  | `/change-password`  | ✅    | Change password     |
| DELETE | `/delete-account`   | ✅    | Soft-delete account |

### Posts  `/api/v1/posts`
| Method | Endpoint          | Auth     | Description              |
|--------|-------------------|----------|--------------------------|
| GET    | `/`               | ❌       | All published posts      |
| GET    | `/:slug`          | ❌       | Single post (+ view++)   |
| GET    | `/user/:userId`   | Optional | Posts by user            |
| POST   | `/`               | ✅       | Create post              |
| PATCH  | `/:id`            | ✅ Owner | Update post              |
| DELETE | `/:id`            | ✅ Owner | Delete post              |

### Comments  (nested under posts)
| Method | Endpoint                    | Auth     | Description     |
|--------|-----------------------------|----------|-----------------|
| GET    | `/posts/:postId/comments`   | ❌       | Get comments    |
| POST   | `/posts/:postId/comments`   | ✅       | Add comment     |
| PATCH  | `/posts/comments/:id`       | ✅ Owner | Edit comment    |
| DELETE | `/posts/comments/:id`       | ✅ Owner | Delete comment  |

### Query Parameters
```
GET /api/v1/posts?page=1&limit=10&sort=views&tag=nodejs&search=express
GET /api/v1/users/:id/posts?page=1&limit=10
```

---

## 🔐 Security Features
- **Helmet** — Secure HTTP headers
- **express-mongo-sanitize** — Prevent NoSQL injection
- **Rate limiting** — Global (100/15min) + Auth routes (20/15min)
- **JWT** — Access token (7d) + Refresh token (30d)
- **Bcrypt** — Password hashing (12 rounds)
- **Input validation** — Joi schemas on all endpoints
- **Password never returned** — `select: false` on schema

## 🏭 Industry Patterns Used
- **Layered architecture** — Controllers → Services → Models
- **Centralized error handling** — `AppError` + global middleware
- **Standardized responses** — `ApiResponse` helper
- **Graceful shutdown** — SIGTERM, unhandledRejection, uncaughtException
- **Soft deletes** — Users set `isActive: false`
- **Owner-only mutations** — Edit/delete enforced in service layer
- **Optional auth** — Public routes can see limited data without token
