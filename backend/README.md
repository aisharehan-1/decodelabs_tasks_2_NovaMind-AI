# NovaMind AI — Project 2: Backend API Development

> **RESTful API built with Node.js & Express.js**  
> DecodeLabs Industrial Training Kit | Batch 2026  
> Designed to power the NovaMind AI Landing Page (Project 1)

---

## 📁 Project Structure

```
NovaMind AI/
│
├── index.html                     ← Frontend (Project 1)
├── css/
│   └── style.css                  ← Frontend styles
├── js/
│   └── main.js                    ← Frontend JS — connects to backend via fetch()
├── assets/                        ← Frontend images & media
│
└── backend/                       ← Project 2: Backend API
    ├── server.js                  ← Entry point — sets up Express, middleware & routes
    ├── package.json               ← Project metadata & npm dependencies
    ├── README.md                  ← This file
    │
    ├── routes/
    │   ├── userRoutes.js          ← GET & POST /api/users  |  GET /api/users/:id
    │   ├── contactRoutes.js       ← GET & POST /api/contact
    │   ├── newsletterRoutes.js    ← GET & POST /api/newsletter
    │   └── authRoutes.js          ← POST /api/login
    │
    ├── controllers/
    │   ├── userController.js      ← Business logic for /api/users
    │   ├── contactController.js   ← Business logic for /api/contact
    │   ├── newsletterController.js← Business logic for /api/newsletter
    │   └── authController.js      ← Business logic for /api/login
    │
    ├── models/
    │   ├── userModel.js           ← In-memory users array ( let users = []; )
    │   ├── contactModel.js        ← In-memory contact submissions store
    │   ├── newsletterModel.js     ← In-memory newsletter subscriber store
    │   └── authModel.js           ← Dummy user credentials store
    │
    └── middleware/
        ├── requestLogger.js       ← Logs every request: method, URL, status & time
        ├── errorHandler.js        ← Global 500 error catcher (4-arg Express middleware)
        └── notFoundHandler.js     ← 404 handler for undefined API routes
```

---

## Technologies Used

| Technology     | Purpose                                       |
|----------------|-----------------------------------------------|
| Node.js        | JavaScript runtime environment                |
| Express.js     | Web framework for routing & middleware        |
| cors           | Cross-Origin Resource Sharing headers         |
| express.json() | Parse incoming JSON request bodies            |
| JavaScript     | Language for both frontend and backend        |
| HTML & CSS     | Frontend (Project 1)                          |
| nodemon        | Auto-restart server on file changes (dev)     |

---

## Installation & Setup

### 1. Prerequisites

Ensure the following are installed:
- Node.js v16 or higher → https://nodejs.org/
- npm (comes bundled with Node.js)

Verify installation:
```bash
node --version
npm --version
```

### 2. Navigate to the Backend Directory

```bash
cd "NovaMind AI/backend"
```

### 3. Install Dependencies

```bash
npm install
```

This installs: **express**, **cors**, **nodemon** (dev)

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

Server starts on: **http://localhost:3000**

Console output:
```
═══════════════════════════════════════════════
  NovaMind AI Backend — Project 2
  DecodeLabs Industrial Training 2026
───────────────────────────────────────────────
  Server  : http://localhost:3000
  API     : http://localhost:3000/api
  Health  : http://localhost:3000/api/health
  Users   : http://localhost:3000/api/users
═══════════════════════════════════════════════
```

Then open your browser and go to: **http://localhost:3000**  
This serves the NovaMind AI frontend automatically.

---

## API Base URL

```
http://localhost:3000/api
```

---

## API Endpoints

---

### GET /api/health
**Purpose:** Health check — confirms the server is running.  
**HTTP Method:** GET  
**URL:** `http://localhost:3000/api/health`  
**Request Body:** None  
**Success Status:** 200 OK

Success Response:
```json
{
  "success": true,
  "message": "NovaMind AI API is running",
  "project": "NovaMind AI Backend",
  "version": "2.0.0",
  "timestamp": "2026-07-29T01:00:00.000Z"
}
```

---

### GET /api/users
**Purpose:** Retrieve all registered users.  
**HTTP Method:** GET  
**URL:** `http://localhost:3000/api/users`  
**Request Body:** None  
**Success Status:** 200 OK

Success Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Aisha",
      "email": "aisha@example.com",
      "createdAt": "2026-07-29T01:00:00.000Z"
    }
  ]
}
```

---

### POST /api/users
**Purpose:** Register a new user.  
**HTTP Method:** POST  
**URL:** `http://localhost:3000/api/users`  
**Request Body:**
```json
{
  "name": "Aisha",
  "email": "aisha@example.com"
}
```
**Success Status:** 201 Created  
**Error Status:** 400 Bad Request

Success Response (201):
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": 1,
    "name": "Aisha",
    "email": "aisha@example.com",
    "createdAt": "2026-07-29T01:00:00.000Z"
  }
}
```

Validation Error Response (400):
```json
{
  "success": false,
  "message": "Name is required and must be a non-empty string."
}
```

Duplicate Email Response (400):
```json
{
  "success": false,
  "message": "Email already exists. Please use a different email address."
}
```

---

### GET /api/users/:id
**Purpose:** Retrieve a single user by their ID.  
**HTTP Method:** GET  
**URL:** `http://localhost:3000/api/users/1`  
**Request Body:** None  
**Success Status:** 200 OK  
**Error Status:** 404 Not Found

Success Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Aisha",
    "email": "aisha@example.com",
    "createdAt": "2026-07-29T01:00:00.000Z"
  }
}
```

Not Found Response (404):
```json
{
  "success": false,
  "message": "User not found."
}
```

---

### POST /api/contact
**Purpose:** Submit the contact form.  
**HTTP Method:** POST  
**URL:** `http://localhost:3000/api/contact`  
**Request Body:**
```json
{
  "name": "Sarah Ahmed",
  "email": "sarah@example.com",
  "phone": "+92 300 1234567",
  "message": "I need an AI solution for my business."
}
```
**Success Status:** 201 Created  
**Error Status:** 400 Bad Request

---

### GET /api/contact
**Purpose:** Retrieve all submitted contact messages.  
**HTTP Method:** GET  
**URL:** `http://localhost:3000/api/contact`  
**Success Status:** 200 OK

---

### POST /api/newsletter
**Purpose:** Subscribe an email to the newsletter.  
**HTTP Method:** POST  
**URL:** `http://localhost:3000/api/newsletter`  
**Request Body:**
```json
{
  "email": "subscriber@example.com"
}
```
**Success Status:** 201 Created  
**Error Status:** 400 Bad Request | 409 Conflict (duplicate)

---

### GET /api/newsletter
**Purpose:** Retrieve all newsletter subscribers.  
**HTTP Method:** GET  
**URL:** `http://localhost:3000/api/newsletter`  
**Success Status:** 200 OK

---

### POST /api/login
**Purpose:** Authenticate a user with email and password.  
**HTTP Method:** POST  
**URL:** `http://localhost:3000/api/login`  
**Request Body:**
```json
{
  "email": "admin@novamind.ai",
  "password": "admin123"
}
```
**Success Status:** 200 OK  
**Error Status:** 400 Bad Request | 401 Unauthorized

Demo Credentials:

| Email                | Password  | Role  |
|----------------------|-----------|-------|
| admin@novamind.ai    | admin123  | admin |
| demo@novamind.ai     | demo1234  | user  |

---

## HTTP Status Codes Used

| Code | Meaning               | When Used                                  |
|------|-----------------------|--------------------------------------------|
| 200  | OK                    | Successful GET requests                    |
| 201  | Created               | Successful POST (resource created)         |
| 400  | Bad Request           | Invalid or missing input data              |
| 401  | Unauthorized          | Wrong login credentials                    |
| 404  | Not Found             | Resource or route does not exist           |
| 409  | Conflict              | Duplicate email (newsletter)               |
| 500  | Internal Server Error | Unexpected server-side error               |

---

## JSON Response Format

All responses follow a consistent structure:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

## Data Validation Rules

| Field              | Rule                                                    |
|--------------------|---------------------------------------------------------|
| user.name          | Required, non-empty string                              |
| user.email         | Required, valid email format, must be unique            |
| contact.name       | Required, non-empty string                              |
| contact.email      | Required, valid email format                            |
| contact.phone      | Required, valid phone format (e.g. +92 300 1234567)     |
| contact.message    | Required, non-empty string                              |
| newsletter.email   | Required, valid format, must be unique                  |
| login.email        | Required, valid email format                            |
| login.password     | Required, non-empty string                              |

---

## Frontend → Backend Integration

The frontend `js/main.js` connects to this backend using the `fetch()` API:

```javascript
const API_BASE = 'http://localhost:3000';

// Contact Form → POST /api/contact
fetch(`${API_BASE}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, phone, message })
});

// Newsletter Form → POST /api/newsletter
fetch(`${API_BASE}/api/newsletter`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

> **IMPORTANT:** Start the backend server BEFORE opening the frontend.  
> Then navigate to http://localhost:3000 to view the full-stack application.

---

## API Testing Guide

### Test 1 — Health Check (200)
```
GET http://localhost:3000/api/health
Expected: 200 OK
```

### Test 2 — Get All Users (200)
```
GET http://localhost:3000/api/users
Expected: 200 OK, data: []
```

### Test 3 — Create Valid User (201)
```
POST http://localhost:3000/api/users
Content-Type: application/json

{ "name": "Aisha", "email": "aisha@example.com" }

Expected: 201 Created
```

### Test 4 — Invalid Data (400)
```
POST http://localhost:3000/api/users
Content-Type: application/json

{ "name": "", "email": "" }

Expected: 400 Bad Request
```

### Test 5 — Duplicate Email (400)
```
POST http://localhost:3000/api/users
Content-Type: application/json

{ "name": "Someone", "email": "aisha@example.com" }

Expected: 400 Bad Request — "Email already exists"
```

### Test 6 — Get Existing User (200)
```
GET http://localhost:3000/api/users/1
Expected: 200 OK
```

### Test 7 — Get Nonexistent User (404)
```
GET http://localhost:3000/api/users/999
Expected: 404 Not Found
```

### Test 8 — Unknown API Route (404)
```
GET http://localhost:3000/api/unknown
Expected: 404 Not Found — JSON with availableEndpoints list
```

### Test 9 — Submit Contact Form (201)
```
POST http://localhost:3000/api/contact
Content-Type: application/json

{
  "name": "Zeeshan",
  "email": "zeeshan@example.com",
  "phone": "+92 300 1234567",
  "message": "I want AI for my business."
}

Expected: 201 Created
```

### Test 10 — Subscribe Newsletter (201)
```
POST http://localhost:3000/api/newsletter
Content-Type: application/json

{ "email": "newsletter@example.com" }

Expected: 201 Created
```

### Test 11 — Duplicate Newsletter (409)
```
POST http://localhost:3000/api/newsletter
Content-Type: application/json

{ "email": "newsletter@example.com" }

Expected: 409 Conflict
```

---

## npm Commands Reference

| Command        | Description                                       |
|----------------|---------------------------------------------------|
| `npm install`  | Install all dependencies from package.json        |
| `npm start`    | Start the server in production mode               |
| `npm run dev`  | Start with Nodemon (auto-restarts on file save)   |

---

## Architecture Overview

```
Request
   │
   ├─ CORS Middleware
   ├─ express.json()    — parse JSON request body
   ├─ requestLogger     — log method, URL, status, time
   │
   ├─ GET  /api/health  → 200 OK (inline)
   ├─ GET  /api         → route index (inline)
   │
   ├─ /api/users        → userRoutes → userController → userModel
   ├─ /api/contact      → contactRoutes → contactController → contactModel
   ├─ /api/newsletter   → newsletterRoutes → newsletterController → newsletterModel
   ├─ /api/login        → authRoutes → authController → authModel
   │
   ├─ notFoundHandler   → 404 JSON for unknown routes
   └─ errorHandler      → 500 JSON for unhandled errors
```

---

## Upgrade Paths (Production Readiness)

| Feature            | Current (Demo)         | Production Upgrade               |
|--------------------|------------------------|----------------------------------|
| Data Storage       | In-memory arrays       | MongoDB / PostgreSQL with ORM    |
| Authentication     | Dummy credentials      | JWT + bcrypt password hashing    |
| Input Sanitisation | Basic regex validation | express-validator / joi          |
| Environment Config | Hardcoded values       | dotenv + .env file               |
| Rate Limiting      | None                   | express-rate-limit               |
| API Documentation  | README                 | Swagger / OpenAPI 3.0            |

---

Author: NovaMind AI Engineering Team  
Built for: DecodeLabs Industrial Training | Project 2 — Backend API Development  
Frontend: NovaMind AI Landing Page (Project 1)

© 2026 NovaMind AI. All rights reserved.
