    # Vehicle Rental Management System

A backend service for managing vehicle rentals with secure authentication, role-based access control, booking management, and automatic vehicle availability updates.  
This system is built using **Node.js, Express.js, TypeScript, PostgreSQL, and NeonDB**, following a clean modular architecture.

---

## ✨ Features

### Authentication & Authorization
- JWT-based login system
- Password hashing using **bcryptjs**
- Role-based access (**Admin**, **Customer**)
- Customers can only access their own bookings
- Admins can access all bookings and all users

### Vehicle Management
- Add, edit, delete vehicles (Admin only)
- Check vehicle `availability_status`
- Auto-update availability when booking is created or completed

### 📅 Booking System
- Create bookings with start/end dates
- Auto-calculate `total_price` using PostgreSQL trigger
- Prevent booking unavailable vehicles
- Returns vehicle details inside booking response
- Returns customer info for Admin

### 🛠 Database
- PostgreSQL schema with relational tables
- Uses **NeonDB** (serverless PostgreSQL)
- Trigger-based price calculation logic

### 📦 Clean Architecture
- Modular pattern: `auth`, `users`, `vehicles`, `bookings`
- Middleware for authentication & role checking
- Route pattern → Controller → Service

---

## 🧰 Technology Stack

| Category | Technology |
|---------|------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL / NeonDB |
| Security | JWT, bcryptjs |
| ORM/Query | pg (node-postgres) |
| Environment | dotenv |

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd <project-folder>

PORT=8080
CONNECTION_STR=your_neondb_connection_string
JWT_SECRET=your_secret_key

npm run dev
