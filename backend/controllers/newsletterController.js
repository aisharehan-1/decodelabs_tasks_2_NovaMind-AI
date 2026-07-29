/* =============================================================================
   controllers/newsletterController.js
   Business logic for the /api/newsletter endpoints.
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Upgraded from Project 2 (in-memory, sync) to MongoDB + Mongoose (async).
   Newsletter subscriptions are now stored persistently.
   Duplicate email prevention is enforced at the database level via a unique index.

   Operations:
     ✓ POST /api/newsletter — validates email, stores subscriber (201 / 409)
     ✓ GET  /api/newsletter — retrieves all subscribers        (200)
   ============================================================================= */

const Newsletter = require('../models/newsletterModel');

// ── Utility ───────────────────────────────────────────────────────────────────

/**
 * isValidEmail – RFC-friendly email format check.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Controller Methods ─────────────────────────────────────────────────────────

/* ---------------------------------------------------------------------------
   POST /api/newsletter
   Validates the email address, saves a new subscriber to MongoDB.
   The unique index on email field prevents duplicate subscriptions
   at the database level (throws MongoServerError code 11000).

   Success:          201 Created  { success, message, data: subscriber }
   Invalid email:    400 Bad Req. { success: false, message }
   Duplicate email:  409 Conflict { success: false, message }
   --------------------------------------------------------------------------- */
async function subscribe(req, res, next) {
  try {
    const { email } = req.body;

    // ── Application-level validation ─────────────────────────────────────────
    if (!email || email.trim() === '') {
      return res.status(400).json({
        success : false,
        message : 'Email address is required.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success : false,
        message : 'Please provide a valid email address.'
      });
    }

    // ── Persist to MongoDB ───────────────────────────────────────────────────
    // If the email is already in the database, MongoDB throws a duplicate-key
    // error (code 11000). errorHandler.js catches this and returns 409 Conflict.
    const saved = await Newsletter.create({ email });

    return res.status(201).json({
      success : true,
      message : 'You have successfully subscribed to the NovaMind AI newsletter!',
      data    : saved
    });

  } catch (err) {
    // Duplicate key error (email already subscribed) → errorHandler.js → 409
    next(err);
  }
}

/* ---------------------------------------------------------------------------
   GET /api/newsletter
   Returns all newsletter subscribers from MongoDB.

   Success: 200 OK  { success, count, data: [ ...subscribers ] }
   --------------------------------------------------------------------------- */
async function getSubscribers(req, res, next) {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });

    return res.status(200).json({
      success : true,
      count   : subscribers.length,
      data    : subscribers
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe, getSubscribers };
