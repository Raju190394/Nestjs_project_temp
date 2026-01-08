# NexusAuth - Enterprise SaaS Authentication Boilerplate

NexusAuth is a production-ready, full-stack authentication system built with **NestJS**, **Next.js 14**, and **Prisma**. It implements industry-standard security practices, including HttpOnly cookie-based JWT flow, refresh token rotation, and Role-Based Access Control (RBAC).

---

## 🚀 Tech Stack

### Backend (NestJS)
- **Framework:** NestJS (latest)
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** MySQL 8
- **Auth:** Passport.js + JWT (Access & Refresh Tokens)
- **Validation:** Zod + nestjs-zod
- **Security:** bcrypt, Rate Limiting (Throttler), HttpOnly Cookies
- **Architecture:** Clean Architecture (Modules, Services, Controllers), SOLID Principles

### Frontend (Next.js)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **State Management:** TanStack Query (React Query)
- **Auth:** AuthContext + custom `useAuth` hook
- **Networking:** Axios with auto-refresh interceptors
- **Route Protection:** Next.js Edge Middleware

---

## ✨ Features

- **Secure Authentication:** 
  - Login & Registration with password hashing.
  - JWT Tokens stored in **HttpOnly, Secure, SameSite=Lax** cookies.
  - Hashed Refresh Tokens stored in DB with automatic rotation.
- **RBAC (Role-Based Access Control):**
  - Roles: `USER`, `ADMIN`.
  - Protected backend routes via `RolesGuard`.
  - Conditional frontend UI based on user role.
- **User Management:**
  - Full CRUD for admins.
  - Profile management for self-users (Update profile, Change password).
- **Modern UI/UX:**
  - Premium Glassmorphism design.
  - Responsive Sidebar & Navigation.
  - Form validation with Zod and React Hook Form.
- **Production Ready:**
  - Dockerized setup for all services.
  - Rate limiting on auth endpoints.
  - Comprehensive error handling and clean API structure.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose
- MySQL (if running locally without Docker)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nexus-auth
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database credentials
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running with Docker (Recommended)
This will spin up the MySQL database, Backend API, and Frontend App.
```bash
docker-compose up --build
```

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:4000`

---

## 🔑 API Endpoints

### Auth Module
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user & set cookies
- `POST /auth/refresh` - Refresh access token using RT
- `POST /auth/logout` - Clear cookies & revoke RT
- `GET  /auth/me` - Get current user info

### Users Module
- `GET    /users/me` - Get own profile
- `PATCH  /users/me` - Update own profile
- `PATCH  /users/change-password` - Change password
- `GET    /users` - (ADMIN) List all users
- `GET    /users/:id` - (ADMIN) Get specific user
- `POST   /users` - (ADMIN) Create new user
- `PATCH  /users/:id` - (ADMIN) Update user
- `DELETE /users/:id` - (ADMIN) Delete user

---

## 🛡️ Security Implementation

- **No LocalStorage:** JWTs are never stored in `localStorage` to prevent XSS attacks.
- **CSRF Protection:** Cookies are configured with `SameSite=Lax`.
- **Token Rotation:** Every time a session is refreshed, a new refresh token is issued and the old one is revoked.
- **Hashed RTs:** Refresh tokens are stored hashed in the MySQL database.
- **Rate Limiting:** Protects against brute-force attacks on login/register endpoints.

---

## 📁 Project Structure

```text
├── backend/
│   ├── prisma/             # Database schema
│   ├── src/
│   │   ├── common/         # Guards, Decorators, Filters
│   │   ├── modules/        # Auth, Users, Prisma modules
│   │   └── main.ts         # App entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js Pages & Layouts
│   │   ├── components/     # UI Components
│   │   ├── context/        # Auth & Query providers
│   │   ├── lib/            # Axios config
│   │   └── middleware.ts   # Edge Auth Guard
│   └── Dockerfile
└── docker-compose.yml      # Service orchestration
```

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
