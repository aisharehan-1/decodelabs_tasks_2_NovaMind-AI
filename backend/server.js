/* =============================================================================
   NovaMind AI Backend — server.js
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Entry point of the Express application.
   Project 3 additions over Project 2:
     ✓ dotenv loaded — reads PORT and MONGODB_URI from backend/.env
     ✓ connectDB()   — establishes the Mongoose/MongoDB connection before
                        the HTTP server starts accepting requests
     ✓ CORS updated  — PUT and DELETE methods are now allowed
     ✓ Health check  — reports database connection status

   API Base URL: http://localhost:3000/api
   ============================================================================= */

// ── Load environment variables FIRST ──────────────────────────────────────────
// dotenv must be required before any other module that reads process.env.
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

// ── Database Connection ────────────────────────────────────────────────────────
const connectDB = require('./config/database');

// ── Route Imports ──────────────────────────────────────────────────────────────
const userRoutes       = require('./routes/userRoutes');
const contactRoutes    = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const authRoutes       = require('./routes/authRoutes');

// ── Middleware Imports ─────────────────────────────────────────────────────────
const requestLogger   = require('./middleware/requestLogger');
const errorHandler    = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

// ── App Initialisation ─────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ── Core Middleware ────────────────────────────────────────────────────────────

/**
 * CORS – allow all origins during development.
 * PUT and DELETE are now included to support full CRUD from the frontend.
 */
app.use(cors({
  origin        : '*',
  methods       : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * express.json() – parse incoming JSON request bodies.
 * Makes req.body available as a JavaScript object in controllers.
 */
app.use(express.json());

/**
 * express.urlencoded() – parse URL-encoded form bodies.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Serve the NovaMind AI frontend from the project root directory.
 * Opening http://localhost:3000 serves index.html automatically.
 */
app.use(express.static(path.join(__dirname, '..')));

/**
 * Custom request logger – logs method, URL, status code & response time.
 * Example output: [2026-07-29] POST /api/users 201 8ms
 */
app.use(requestLogger);

// ── Health Check Endpoint ─────────────────────────────────────────────────────

/**
 * GET /api/health
 * Returns server status plus MongoDB connection state.
 * Mongoose connection states: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
 */
const mongoose = require('mongoose');

app.get('/api/health', (req, res) => {
  const dbState   = mongoose.connection.readyState;
  const dbStatus  = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState];
  const dbHealthy = dbState === 1;

  res.status(dbHealthy ? 200 : 503).json({
    success   : dbHealthy,
    message   : dbHealthy
                  ? 'NovaMind AI API is running and database is connected.'
                  : 'NovaMind AI API is running but database is not connected.',
    project   : 'NovaMind AI Backend',
    version   : '3.0.0',
    database  : {
      status  : dbStatus,
      name    : mongoose.connection.name || 'n/a'
    },
    timestamp : new Date().toISOString()
  });
});

// ── API Root ──────────────────────────────────────────────────────────────────

/**
 * GET /api
 * Lists all available endpoints.
 */
app.get('/api', (req, res) => {
  res.status(200).json({
    success  : true,
    message  : 'Welcome to the NovaMind AI RESTful API — Project 3: Database Integration',
    version  : '3.0.0',
    database : 'MongoDB + Mongoose',
    endpoints: {
      health      : 'GET    /api/health',
      users       : 'GET    /api/users',
      createUser  : 'POST   /api/users',
      userById    : 'GET    /api/users/:id',
      updateUser  : 'PUT    /api/users/:id',
      deleteUser  : 'DELETE /api/users/:id',
      contact     : 'GET    /api/contact    |  POST /api/contact',
      newsletter  : 'GET    /api/newsletter |  POST /api/newsletter',
      login       : 'POST   /api/login'
    }
  });
});

// ── Mount Feature Routers under /api/ ─────────────────────────────────────────

app.use('/api/users',      userRoutes);       // Full CRUD: GET, POST, PUT, DELETE
app.use('/api/contact',    contactRoutes);    // GET, POST /api/contact
app.use('/api/newsletter', newsletterRoutes); // GET, POST /api/newsletter
app.use('/api/login',      authRoutes);       // POST /api/login

// ── Error & 404 Middleware ─────────────────────────────────────────────────────
// IMPORTANT: These MUST be registered AFTER all routes.

app.use(notFoundHandler); // 404 — route not matched → JSON response
app.use(errorHandler);    // 500 — unhandled errors  → JSON response

// ── Connect to MongoDB, then start HTTP server ─────────────────────────────────
// The server does NOT start listening until the database connection succeeds.
// This prevents the API from serving requests without a working database.

async function startServer() {
  await connectDB(); // Will exit process if connection fails

  app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════');
    console.log('  NovaMind AI Backend — Project 3');
    console.log('  Database Integration | DecodeLabs 2026');
    console.log('───────────────────────────────────────────────');
    console.log(`  Server   : http://localhost:${PORT}`);
    console.log(`  API      : http://localhost:${PORT}/api`);
    console.log(`  Health   : http://localhost:${PORT}/api/health`);
    console.log(`  Users    : http://localhost:${PORT}/api/users`);
    console.log('  Database : MongoDB (Mongoose)');
    console.log('═══════════════════════════════════════════════');
  });
}

startServer();

module.exports = app; // Exported for potential future test suites
