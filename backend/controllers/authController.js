/* =============================================================================
   controllers/authController.js
   Business logic for the /login endpoint.
   Performs dummy credential validation — no real JWT in this demo.
   Replace with proper JWT + bcrypt for production.
   ============================================================================= */

const { findUserByEmail, validatePassword } = require('../models/authModel');

// ── Utility ───────────────────────────────────────────────────────────────────

/**
 * isValidEmail – RFC-friendly email format check.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ── Controller Methods ─────────────────────────────────────────────────────────

/**
 * login – POST /login
 * Validates email & password, performs a dummy authentication check,
 * and returns a success/failure response with simulated session data.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // ── Input Presence Validation ───────────────────────────────────────────
    if (!email || email.trim() === '') {
      return res.status(400).json({
        success : false,
        message : 'Email address is required.'
      });
    }

    if (!password || password.trim() === '') {
      return res.status(400).json({
        success : false,
        message : 'Password is required.'
      });
    }

    // ── Email Format Validation ─────────────────────────────────────────────
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success : false,
        message : 'Please provide a valid email address.'
      });
    }

    // ── User Look-up ────────────────────────────────────────────────────────
    const user = findUserByEmail(email);

    if (!user) {
      // Return 401 to avoid leaking whether the email exists
      return res.status(401).json({
        success : false,
        message : 'Invalid email or password.'
      });
    }

    // ── Password Check ──────────────────────────────────────────────────────
    if (!validatePassword(password, user.password)) {
      return res.status(401).json({
        success : false,
        message : 'Invalid email or password.'
      });
    }

    // ── Success Response ────────────────────────────────────────────────────
    // In production, sign and return a JWT token here.
    return res.status(200).json({
      success : true,
      message : `Welcome back, ${user.name}! Login successful.`,
      data    : {
        id       : user.id,
        name     : user.name,
        email    : user.email,
        role     : user.role,
        token    : 'demo_token_novamind_ai_2026',   // Placeholder – use JWT in production
        loggedAt : new Date().toISOString()
      }
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { login };
