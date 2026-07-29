/* =============================================================================
   NovaMind AI Backend — server.js
   Project 2: Backend API Development | DecodeLabs Industrial Training 2026

   Entry point of the Express application.
   Wires up middleware, mounts /api/ routes, and starts the HTTP server.

   API Base URL: http://localhost:3000/api
   ============================================================================= */

const express = require('express');
const cors    = require('cors');
const path    = require('path');

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
 * CORS – allow requests from any origin.
 * This lets the HTML frontend (opened as a file:// or on a different port)
 * communicate freely with the API during development.
 */
app.use(cors({
  origin      : '*',
  methods     : ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * express.json() – parse incoming JSON request bodies.
 * Makes req.body available as a JavaScript object in controllers.
 */
app.use(express.json());

/**
 * express.urlencoded() – parse URL-encoded form bodies (belt-and-braces).
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Serve the NovaMind AI frontend from the project root directory.
 * With this, opening http://localhost:3000 serves index.html automatically.
 */
app.use(express.static(path.join(__dirname, '..')));

/**
 * Custom request logger – logs method, URL, status code & response time.
 * Example output: [2026-07-29] GET /api/health 200 3ms
 */
app.use(requestLogger);

// ── Health Check Endpoint ─────────────────────────────────────────────────────

/**
 * GET /api/health
 * Simple health-check so you can verify the server is running.
 * Useful for testing and deployment checks.
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "message": "NovaMind AI API is running"
 * }
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success   : true,
    message   : 'NovaMind AI API is running',
    project   : 'NovaMind AI Backend',
    version   : '2.0.0',
    timestamp : new Date().toISOString()
  });
});

// ── API Status (root route) ────────────────────────────────────────────────────

/**
 * GET /api
 * Root API route — lists all available endpoints.
 * Useful for quick orientation when the API is hit directly.
 */
app.get('/api', (req, res) => {
  res.status(200).json({
    success  : true,
    message  : 'Welcome to the NovaMind AI RESTful API',
    version  : '2.0.0',
    endpoints: {
      health     : 'GET  /api/health',
      users      : 'GET  /api/users',
      createUser : 'POST /api/users',
      userById   : 'GET  /api/users/:id',
      contact    : 'GET  /api/contact    |  POST /api/contact',
      newsletter : 'GET  /api/newsletter |  POST /api/newsletter',
      login      : 'POST /api/login'
    }
  });
});

// ── Mount Feature Routers under /api/ ─────────────────────────────────────────
// RESTful convention: resources are nouns, HTTP methods are the verbs.

app.use('/api/users',      userRoutes);       // GET, POST /api/users  |  GET /api/users/:id
app.use('/api/contact',    contactRoutes);    // GET, POST /api/contact
app.use('/api/newsletter', newsletterRoutes); // GET, POST /api/newsletter
app.use('/api/login',      authRoutes);       // POST /api/login

// ── Error & 404 Middleware ─────────────────────────────────────────────────────
// IMPORTANT: These MUST be registered AFTER all routes.

app.use(notFoundHandler); // 404 — route not matched → JSON response
app.use(errorHandler);    // 500 — unhandled errors  → JSON response

// ── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════');
  console.log('  NovaMind AI Backend — Project 2');
  console.log('  DecodeLabs Industrial Training 2026');
  console.log('───────────────────────────────────────────────');
  console.log(`  Server  : http://localhost:${PORT}`);
  console.log(`  API     : http://localhost:${PORT}/api`);
  console.log(`  Health  : http://localhost:${PORT}/api/health`);
  console.log(`  Users   : http://localhost:${PORT}/api/users`);
  console.log('═══════════════════════════════════════════════');
});

module.exports = app; // Exported for potential future test suites
