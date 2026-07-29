/* =============================================================================
   controllers/userController.js
   Business logic for the /api/users endpoints.

   Demonstrates core Project 2 concepts:
     ✓ GET  /api/users      — retrieve all users (200)
     ✓ POST /api/users      — create new user with validation (201 / 400)
     ✓ GET  /api/users/:id  — retrieve one user by ID (200 / 404)
     ✓ Data validation (name + email)
     ✓ Duplicate email prevention
     ✓ Semantic HTTP status codes
     ✓ Consistent JSON response format
     ✓ Centralised error forwarding via next(err)
   ============================================================================= */

const {
  getAllUsers,
  findUserById,
  emailExists,
  createUser
} = require('../models/userModel');

// ── Utility ───────────────────────────────────────────────────────────────────

/**
 * isValidEmail – checks basic email format using a regex.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ── Controller Methods ─────────────────────────────────────────────────────────

/**
 * getUsers – GET /api/users
 * Returns all registered users wrapped in a consistent success envelope.
 *
 * Success: 200 OK
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function getUsers(req, res, next) {
  try {
    const all = getAllUsers();

    return res.status(200).json({
      success : true,
      count   : all.length,
      data    : all
    });

  } catch (err) {
    next(err); // Forward unexpected errors → errorHandler middleware
  }
}

/**
 * getUserById – GET /api/users/:id
 * Returns a single user matched by numeric ID.
 *
 * Success:   200 OK
 * Not found: 404 Not Found
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function getUserById(req, res, next) {
  try {
    // Parse the :id param — it arrives as a string so convert to a number
    const id = parseInt(req.params.id, 10);

    // Validate that the ID is a proper positive integer
    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success : false,
        message : 'Invalid user ID. ID must be a positive integer.'
      });
    }

    const user = findUserById(id);

    // Return 404 if no user matches the given ID
    if (!user) {
      return res.status(404).json({
        success : false,
        message : 'User not found.'
      });
    }

    return res.status(200).json({
      success : true,
      data    : user
    });

  } catch (err) {
    next(err);
  }
}

/**
 * createUser – POST /api/users
 * Validates the request body, prevents duplicate emails, creates a new user.
 *
 * Success:          201 Created
 * Validation error: 400 Bad Request
 * Duplicate email:  400 Bad Request
 *
 * Expected request body:
 * {
 *   "name":  "Aisha",
 *   "email": "aisha@example.com"
 * }
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function createUserHandler(req, res, next) {
  try {
    // ── Never Trust the Client — always check that fields exist first ──────
    const { name, email } = req.body;

    // ── Validate: Name ──────────────────────────────────────────────────────
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success : false,
        message : 'Name is required and must be a non-empty string.'
      });
    }

    // ── Validate: Email presence ────────────────────────────────────────────
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({
        success : false,
        message : 'Email is required.'
      });
    }

    // ── Validate: Email format ──────────────────────────────────────────────
    if (!isValidEmail(email.trim())) {
      return res.status(400).json({
        success : false,
        message : 'Please provide a valid email address.'
      });
    }

    // ── Validate: Duplicate email ───────────────────────────────────────────
    if (emailExists(email)) {
      return res.status(400).json({
        success : false,
        message : 'Email already exists. Please use a different email address.'
      });
    }

    // ── All checks passed — create and store the new user ──────────────────
    const saved = createUser({ name, email });

    return res.status(201).json({
      success : true,
      message : 'User created successfully.',
      data    : saved
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, getUserById, createUser: createUserHandler };
