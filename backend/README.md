# NovaMind AI — Project 3: Database Integration

> **RESTful API + MongoDB + Mongoose**  
> DecodeLabs Industrial Training Kit | Batch 2026  
> Builds on Project 1 (Frontend) and Project 2 (Backend API)

---

## Project Overview

NovaMind AI now uses **persistent database storage** powered by **MongoDB and Mongoose**.

In Project 2, all data (users, contacts, newsletter subscribers) was stored in temporary in-memory JavaScript arrays. Every time the server restarted, all data was lost.

**Project 3 eliminates this entirely:**

- All user registrations are stored permanently in MongoDB.
- All contact form submissions are stored permanently in MongoDB.
- All newsletter subscriptions are stored permanently in MongoDB.
- Data survives server restarts — proving genuine persistent storage.
- Full CRUD (Create, Read, Update, Delete) is implemented for the User resource.
- Database-level constraints enforce data integrity.
- Mongoose schema validation provides application-level defence.

---

## 📁 Project Structure

```
NovaMind AI/
│
├── index.html                        ← Frontend (Project 1)
├── css/
│   └── style.css                     ← Frontend styles
├── js/
│   └── main.js                       ← Frontend JS — connects to backend via fetch()
├── assets/                           ← Frontend images & media
│
└── backend/                          ← Project 2 & 3: Backend API
    ├── server.js                     ← Entry point — dotenv, connectDB, Express, routes
    ├── package.json                  ← Dependencies: express, mongoose, dotenv, cors
    ├── .env                          ← Environment variables (NOT in version control)
    ├── .env.example                  ← Safe placeholder for version control
    ├── README.md                     ← This file
    │
    ├── config/
    │   └── database.js               ← MongoDB connection using Mongoose
    │
    ├── models/                       ← Mongoose schemas — database is source of truth
    │   ├── userModel.js              ← User schema: name, email, role, timestamps
    │   ├── contactModel.js           ← Contact schema: name, email, phone, message
    │   ├── newsletterModel.js        ← Newsletter schema: email (unique), subscribedAt
    │   └── authModel.js              ← Demo credentials store (kept from Project 2)
    │
    ├── controllers/                  ← Business logic (async/await + Mongoose)
    │   ├── userController.js         ← Full CRUD: GET, POST, PUT, DELETE
    │   ├── contactController.js      ← GET, POST (MongoDB-backed)
    │   ├── newsletterController.js   ← GET, POST (MongoDB-backed, unique email)
    │   └── authController.js         ← Demo login (kept from Project 2)
    │
    ├── routes/
    │   ├── userRoutes.js             ← Full CRUD routes for /api/users
    │   ├── contactRoutes.js          ← GET & POST /api/contact
    │   ├── newsletterRoutes.js       ← GET & POST /api/newsletter
    │   └── authRoutes.js             ← POST /api/login
    │
    └── middleware/
        ├── requestLogger.js          ← Logs method, URL, status, time
        ├── errorHandler.js           ← Global error handler (Mongoose-aware)
        └── notFoundHandler.js        ← 404 JSON handler
```

---

## Technologies

| Technology     | Version  | Purpose                                           |
|----------------|----------|---------------------------------------------------|
| Node.js        | v16+     | JavaScript runtime environment                    |
| Express.js     | ^4.18.2  | Web framework for routing & middleware            |
| MongoDB        | Atlas/Local | NoSQL database — persistent storage            |
| Mongoose       | ^8.x     | ODM — schemas, validation, model methods          |
| dotenv         | ^16.x    | Loads environment variables from .env             |
| cors           | ^2.8.5   | Cross-Origin Resource Sharing headers             |
| nodemon        | ^3.0.1   | Auto-restart server on file changes (dev)         |

---

## Why MongoDB?

MongoDB was selected because:

1. **Natural fit with Node.js/Express** — JavaScript objects map directly to BSON documents without a separate ORM translation layer.
2. **Mongoose ODM** — provides schemas, validation, hooks, and query methods on top of the native MongoDB driver.
3. **Flexible document model** — ideal for the NovaMind AI data structures (user profiles, contact messages, newsletter subscriptions).
4. **Cloud-ready** — MongoDB Atlas provides a free tier with zero server management.
5. **Unique indexes** — MongoDB enforces `unique: true` constraints at the database engine level, not just the application layer.

---

## Database Collections & Schemas

### Collection: `users`

Stores registered user accounts.

| Field       | Type   | Constraints                              |
|-------------|--------|------------------------------------------|
| `_id`       | ObjectId | Auto-generated primary key             |
| `name`      | String | Required, minLength 2, maxLength 100     |
| `email`     | String | Required, unique, lowercase, email format|
| `role`      | String | Enum: `user` \| `admin`, default `user` |
| `createdAt` | Date   | Auto-managed by Mongoose timestamps      |
| `updatedAt` | Date   | Auto-managed by Mongoose timestamps      |

### Collection: `contacts`

Stores contact form submissions.

| Field       | Type   | Constraints                              |
|-------------|--------|------------------------------------------|
| `_id`       | ObjectId | Auto-generated primary key             |
| `name`      | String | Required, minLength 2, maxLength 100     |
| `email`     | String | Required, lowercase, email format        |
| `phone`     | String | Required                                 |
| `message`   | String | Required, minLength 10, maxLength 2000   |
| `createdAt` | Date   | Auto-managed                             |

### Collection: `newsletters`

Stores newsletter subscriber emails.

| Field          | Type   | Constraints                           |
|----------------|--------|---------------------------------------|
| `_id`          | ObjectId | Auto-generated primary key          |
| `email`        | String | Required, unique, lowercase, email format |
| `subscribedAt` | Date   | Defaults to `Date.now`               |

---

## Database Relationships

### Primary Key / Foreign Key Concepts

MongoDB uses **`_id` (ObjectId)** as the primary identifier for every document. This corresponds conceptually to the primary key in relational databases.

If relationships are implemented between collections, Mongoose references are used:

```js
// Example: a Contact referencing a User (one-to-many)
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref : 'User'
}
```

### Relationship Types Explained

#### One-to-One
One User → One UserProfile  
*Example: a user's profile details stored in a separate collection linked by `user: ObjectId`.*

#### One-to-Many
One User → Many Orders / Contact Records  
*Example: one user account submitting multiple contact forms.*

#### Many-to-Many
Many Students ↔ Many Courses  
*Example: implemented via an intermediary "enrollments" collection.*

**For NovaMind AI**, contacts and newsletter subscriptions are independent collections. No explicit foreign-key references are enforced — each submission stands alone. If authentication is expanded in a future project, contacts could reference a `User._id`.

---

## Security: Input Safety & Query Security

The MongoDB/Mongoose stack is designed to prevent the class of vulnerability equivalent to SQL injection:

1. **Mongoose model methods only** — All database operations use Mongoose methods (`User.find()`, `User.findById()`, `User.findByIdAndUpdate()`, etc.). Raw MongoDB query strings are never constructed by concatenating user input.

2. **Input treated as data, not executable logic** — User-supplied values (name, email, message, id) are passed as typed JavaScript values to Mongoose, which serialises them safely to BSON. They cannot modify query structure.

3. **ObjectId validation before queries** — `mongoose.Types.ObjectId.isValid(id)` is called before every `findById` or `findByIdAndUpdate`. An invalid ID is rejected with 400 before any database operation.

4. **Mass-assignment prevention** — Controllers extract only the specific fields they allow (`{ name, email, role } = req.body`), ignoring unknown keys. Clients cannot inject extra fields like `__v`, `_id`, or `createdAt`.

5. **Schema-level validation** — Mongoose `required`, `enum`, `match`, `minlength`, and `maxlength` validators reject malformed data before it reaches the database.

6. **No credentials in source code** — The MongoDB connection URI is read exclusively from the `.env` file via `dotenv`. The `.env` file is excluded from version control via `.gitignore`.

---

## Installation

### Prerequisites

- Node.js v16 or higher → https://nodejs.org/
- MongoDB Atlas account (free tier) → https://cloud.mongodb.com  
  OR locally installed MongoDB → https://www.mongodb.com/try/download/community

### 1. Navigate to the Backend Directory

```bash
cd "NovaMind AI/backend"
```

### 2. Install Dependencies

```bash
npm install
```

This installs: **express**, **mongoose**, **dotenv**, **cors**, **nodemon** (dev)

---

## Environment Setup

### 1. Create your `.env` file

```bash
# In the backend/ directory:
cp .env.example .env
```

Or manually create `backend/.env` with the following content:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

### 2. Get your MongoDB URI

**MongoDB Atlas (recommended — free tier):**
1. Create a free cluster at https://cloud.mongodb.com
2. Database Access → Add Database User (username + password)
3. Network Access → Allow access from `0.0.0.0/0` (or your IP)
4. Clusters → Connect → Drivers → Copy connection string
5. Replace `<username>`, `<password>`, and `<dbname>` in the URI

Example URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/novamind_ai?retryWrites=true&w=majority
```

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/novamind_ai
```

---

## Running the Server

### Development Mode (auto-reload on file save)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

or:

```bash
node server.js
```

**Expected console output:**

```
───────────────────────────────────────────────
  ✅ MongoDB Connected Successfully
  Database : novamind_ai
───────────────────────────────────────────────
═══════════════════════════════════════════════
  NovaMind AI Backend — Project 3
  Database Integration | DecodeLabs 2026
───────────────────────────────────────────────
  Server   : http://localhost:3000
  API      : http://localhost:3000/api
  Health   : http://localhost:3000/api/health
  Users    : http://localhost:3000/api/users
  Database : MongoDB (Mongoose)
═══════════════════════════════════════════════
```

Then open: **http://localhost:3000**  
This serves the NovaMind AI frontend automatically.

---

## CRUD API Documentation

### CRUD Operation Mapping

```
CREATE → POST   /api/users       → MongoDB: User.create()
READ   → GET    /api/users       → MongoDB: User.find()
READ   → GET    /api/users/:id   → MongoDB: User.findById()
UPDATE → PUT    /api/users/:id   → MongoDB: User.findByIdAndUpdate()
DELETE → DELETE /api/users/:id   → MongoDB: User.findByIdAndDelete()
```

---

### GET /api/health
**Purpose:** Health check — server + database status  
**Method:** GET  
**URL:** `http://localhost:3000/api/health`  
**Success Status:** 200 OK (connected) | 503 Service Unavailable (DB down)

```json
{
  "success": true,
  "message": "NovaMind AI API is running and database is connected.",
  "version": "3.0.0",
  "database": {
    "status": "connected",
    "name": "novamind_ai"
  },
  "timestamp": "2026-07-29T01:00:00.000Z"
}
```

---

### GET /api/users
**Purpose:** Retrieve all users from MongoDB  
**Method:** GET  
**Success Status:** 200 OK

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "64a1f2b3c4d5e6f7a8b9c0d1",
      "name": "Aisha",
      "email": "aisha@example.com",
      "role": "user",
      "createdAt": "2026-07-29T01:00:00.000Z",
      "updatedAt": "2026-07-29T01:00:00.000Z"
    }
  ]
}
```

---

### POST /api/users
**Purpose:** Create a new user (persisted to MongoDB)  
**Method:** POST  
**Request Body:**
```json
{
  "name": "Aisha",
  "email": "aisha@example.com",
  "role": "user"
}
```
**Success Status:** 201 Created  
**Error Status:** 400 Bad Request | 409 Conflict

Success (201):
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": "64a1f2b3c4d5e6f7a8b9c0d1",
    "name": "Aisha",
    "email": "aisha@example.com",
    "role": "user",
    "createdAt": "2026-07-29T01:00:00.000Z"
  }
}
```

Duplicate Email (409):
```json
{
  "success": false,
  "message": "A record with this email already exists."
}
```

Validation Error (400):
```json
{
  "success": false,
  "message": "Validation failed. Please check the submitted data.",
  "errors": {
    "name": "Name is required."
  }
}
```

---

### GET /api/users/:id
**Purpose:** Retrieve one user by MongoDB ObjectId  
**Method:** GET  
**URL:** `http://localhost:3000/api/users/64a1f2b3c4d5e6f7a8b9c0d1`  
**Success Status:** 200 OK  
**Error Status:** 400 (invalid ID) | 404 Not Found

Success (200):
```json
{
  "success": true,
  "data": {
    "id": "64a1f2b3c4d5e6f7a8b9c0d1",
    "name": "Aisha",
    "email": "aisha@example.com",
    "role": "user"
  }
}
```

Invalid ID (400):
```json
{
  "success": false,
  "message": "Invalid user ID format. Please provide a valid MongoDB ObjectId."
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "User not found."
}
```

---

### PUT /api/users/:id
**Purpose:** Update an existing user  
**Method:** PUT  
**Request Body (all fields optional):**
```json
{
  "name": "Aisha Updated",
  "role": "admin"
}
```
**Success Status:** 200 OK  
**Error Status:** 400 | 404 | 409

Success (200):
```json
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "id": "64a1f2b3c4d5e6f7a8b9c0d1",
    "name": "Aisha Updated",
    "email": "aisha@example.com",
    "role": "admin"
  }
}
```

---

### DELETE /api/users/:id
**Purpose:** Delete a user from MongoDB  
**Method:** DELETE  
**Success Status:** 200 OK  
**Error Status:** 400 | 404

Success (200):
```json
{
  "success": true,
  "message": "User deleted successfully.",
  "data": { "id": "64a1f2b3c4d5e6f7a8b9c0d1" }
}
```

---

### POST /api/contact
**Purpose:** Submit the contact form (stored in MongoDB)  
**Method:** POST  
**Request Body:**
```json
{
  "name": "Sarah Ahmed",
  "email": "sarah@example.com",
  "phone": "+92 300 1234567",
  "message": "I need an AI solution for my business."
}
```
**Success Status:** 201 Created | **Error Status:** 400

---

### GET /api/contact
**Purpose:** Retrieve all contact submissions from MongoDB  
**Method:** GET  
**Success Status:** 200 OK

---

### POST /api/newsletter
**Purpose:** Subscribe an email (stored in MongoDB with unique constraint)  
**Method:** POST  
**Request Body:**
```json
{ "email": "subscriber@example.com" }
```
**Success Status:** 201 Created  
**Error Status:** 400 | 409 (duplicate)

---

### GET /api/newsletter
**Purpose:** Retrieve all subscribers from MongoDB  
**Method:** GET  
**Success Status:** 200 OK

---

### POST /api/login
**Purpose:** Authenticate a user (demo credentials — unchanged from Project 2)  
**Method:** POST  
**Request Body:**
```json
{
  "email": "admin@novamind.ai",
  "password": "admin123"
}
```

Demo Credentials:

| Email             | Password  | Role  |
|-------------------|-----------|-------|
| admin@novamind.ai | admin123  | admin |
| demo@novamind.ai  | demo1234  | user  |

---

## HTTP Status Codes

| Code | Meaning               | When Used                                         |
|------|-----------------------|---------------------------------------------------|
| 200  | OK                    | Successful GET or DELETE                          |
| 201  | Created               | Successful POST (resource created in MongoDB)     |
| 400  | Bad Request           | Invalid input, missing fields, bad ObjectId       |
| 401  | Unauthorized          | Wrong login credentials                           |
| 404  | Not Found             | Resource or route does not exist                  |
| 409  | Conflict              | Duplicate email (unique constraint violation)     |
| 500  | Internal Server Error | Unexpected server-side error                      |
| 503  | Service Unavailable   | Database not connected                            |

---

## Database Testing Guide

### Test 1 — Health Check (200, DB connected)
```
GET http://localhost:3000/api/health
Expected: 200 OK — "database.status": "connected"
```

### Test 2 — Create User (201)
```
POST http://localhost:3000/api/users
Content-Type: application/json

{ "name": "Aisha", "email": "aisha@example.com", "role": "user" }

Expected: 201 Created
```

### Test 3 — Get All Users (200, from MongoDB)
```
GET http://localhost:3000/api/users
Expected: 200 OK — data array contains the created user
```

### Test 4 — Get User by ID (200)
```
GET http://localhost:3000/api/users/<id from Test 2>
Expected: 200 OK
```

### Test 5 — Update User (200)
```
PUT http://localhost:3000/api/users/<id>
Content-Type: application/json

{ "name": "Aisha Updated", "role": "admin" }

Expected: 200 OK — updated fields reflected
```

### Test 6 — Delete User (200)
```
DELETE http://localhost:3000/api/users/<id>
Expected: 200 OK — "User deleted successfully."
```

### Test 7 — Invalid ID (400)
```
GET http://localhost:3000/api/users/not-a-real-id
Expected: 400 Bad Request — "Invalid user ID format"
```

### Test 8 — Non-existent User (404)
```
GET http://localhost:3000/api/users/000000000000000000000000
Expected: 404 Not Found
```

### Test 9 — Duplicate Email (409)
```
POST http://localhost:3000/api/users
{ "name": "Another", "email": "aisha@example.com" }
(same email as Test 2 — after deleting, re-create first)

Expected: 409 Conflict — "A record with this email already exists."
```

### Test 10 — Invalid Data (400)
```
POST http://localhost:3000/api/users
{ "name": "", "email": "not-an-email" }

Expected: 400 Bad Request
```

### Test 11 — Restart Persistence (Proves MongoDB)
```
1. POST /api/users  → create a user
2. Restart node server.js
3. GET  /api/users  → user still exists (MongoDB persisted it)

Expected: User is still present after restart
```

### Test 12 — Contact Form (201)
```
POST http://localhost:3000/api/contact
{
  "name": "Zeeshan",
  "email": "zeeshan@example.com",
  "phone": "+92 300 1234567",
  "message": "I want AI for my business."
}
Expected: 201 Created
```

### Test 13 — Newsletter Duplicate (409)
```
POST http://localhost:3000/api/newsletter  (twice, same email)
Expected first: 201 Created
Expected second: 409 Conflict
```

---

## Architecture Overview

```
Frontend (index.html + js/main.js)
     │  fetch('/api/contact')
     │  fetch('/api/newsletter')
     ▼
Express HTTP Server (server.js)
     │
     ├─ CORS Middleware         — allows PUT & DELETE from all origins
     ├─ express.json()          — parse JSON request body
     ├─ requestLogger           — log method, URL, status, time
     │
     ├─ GET  /api/health        → MongoDB status check
     ├─ GET  /api               → endpoint directory
     │
     ├─ /api/users              → userRoutes
     │       │                       ├─ GET    /       → getUsers()
     │       │                       ├─ POST   /       → createUser()
     │       │                       ├─ GET    /:id    → getUserById()
     │       │                       ├─ PUT    /:id    → updateUser()
     │       │                       └─ DELETE /:id    → deleteUser()
     │       ▼
     │   userController (async)
     │       ▼
     │   User (Mongoose Model)
     │       ▼
     │   MongoDB "users" collection
     │
     ├─ /api/contact            → contactRoutes → contactController → Contact model → MongoDB
     ├─ /api/newsletter         → newsletterRoutes → newsletterController → Newsletter model → MongoDB
     ├─ /api/login              → authRoutes → authController → demo credentials
     │
     ├─ notFoundHandler         → 404 JSON for unknown routes
     └─ errorHandler            → Mongoose ValidationError / CastError / 11000 / 500
```

---

## npm Commands Reference

| Command        | Description                                        |
|----------------|----------------------------------------------------|
| `npm install`  | Install all dependencies from package.json         |
| `npm start`    | Start the server (production)                      |
| `npm run dev`  | Start with Nodemon (auto-restarts on file save)    |

---

Author: NovaMind AI Engineering Team  
Built for: DecodeLabs Industrial Training | Project 3 — Database Integration  
Frontend: NovaMind AI Landing Page (Project 1)  
Backend API: Project 2 (upgraded in Project 3)

© 2026 NovaMind AI. All rights reserved.
