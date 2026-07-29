/* =============================================================================
   controllers/userController.js
   Business logic for the /api/users endpoints.
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Upgraded from Project 2 (in-memory, sync) to MongoDB + Mongoose (async).

   CRUD Operations:
     ✓ GET    /api/users      — retrieve all users from MongoDB        (200)
     ✓ POST   /api/users      — create new user, persist to MongoDB    (201)
     ✓ GET    /api/users/:id  — retrieve one user by MongoDB ObjectId  (200 / 404)
     ✓ PUT    /api/users/:id  — update an existing user               (200 / 404)
     ✓ DELETE /api/users/:id  — remove a user from MongoDB            (200 / 404)

   Security:
     • All DB queries use Mongoose model methods — no raw query concatenation.
     • ObjectId validity checked before every findById call.
     • Input is validated before any database operation runs.
     • Duplicate-key errors (code 11000) caught and surfaced as 409 Conflict.
   ============================================================================= */

const mongoose = require('mongoose');
const User     = require('../models/userModel');

// ── Utility ───────────────────────────────────────────────────────────────────

/**
 * isValidObjectId – checks whether a string is a valid MongoDB ObjectId.
 * Prevents Mongoose CastError by validating before the query reaches the DB.
 *
 * @param {string} id
 * @returns {boolean}
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ── Controller Methods ─────────────────────────────────────────────────────────

/* ---------------------------------------------------------------------------
   GET /api/users
   Returns all users stored in MongoDB.

   Success: 200 OK  { success, count, data: [ ...users ] }
   --------------------------------------------------------------------------- */
async function getUsers(req, res, next) {
  try {
    // User.find() retrieves every document from the "users" collection.
    // Sort by newest first so the most recently registered users appear first.
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success : true,
      count   : users.length,
      data    : users
    });

  } catch (err) {
    next(err);
  }
}

/* ---------------------------------------------------------------------------
   GET /api/users/:id
   Retrieves a single user by MongoDB ObjectId.

   Success:       200 OK        { success, data: user }
   Invalid ID:    400 Bad Req.  { success: false, message }
   Not found:     404 Not Found { success: false, message }
   --------------------------------------------------------------------------- */
async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    // ── Validate ObjectId format before querying ─────────────────────────────
    // This prevents Mongoose CastError from propagating to the error handler.
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success : false,
        message : 'Invalid user ID format. Please provide a valid MongoDB ObjectId.'
      });
    }

    const user = await User.findById(id);

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

/* ---------------------------------------------------------------------------
   POST /api/users
   Creates a new user and saves it to MongoDB.

   Expected body: { name, email, role? }

   Success:          201 Created  { success, message, data: user }
   Validation error: 400 Bad Req. { success: false, message }
   Duplicate email:  409 Conflict { success: false, message }
   --------------------------------------------------------------------------- */
async function createUserHandler(req, res, next) {
  try {
    // ── Extract only the fields we expect — ignore everything else ───────────
    // This prevents mass-assignment: clients cannot inject extra fields.
    const { name, email, role } = req.body;

    // ── Application-level presence checks (before hitting the DB) ────────────
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success : false,
        message : 'Name is required and must be a non-empty string.'
      });
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({
        success : false,
        message : 'Email address is required.'
      });
    }

    // ── Create the Mongoose document — schema validation runs here ───────────
    // If required fields are missing, invalid email, or bad role enum,
    // Mongoose throws a ValidationError which errorHandler.js maps to 400.
    const user = new User({ name, email, role });
    const saved = await user.save();

    return res.status(201).json({
      success : true,
      message : 'User created successfully.',
      data    : saved
    });

  } catch (err) {
    // Duplicate key errors (unique email) are handled in errorHandler.js → 409
    next(err);
  }
}

/* ---------------------------------------------------------------------------
   PUT /api/users/:id
   Updates an existing user's data.

   Expected body (all optional): { name?, email?, role? }

   Success:          200 OK       { success, message, data: updatedUser }
   Invalid ID:       400 Bad Req. { success: false, message }
   Not found:        404 Not Found { success: false, message }
   Duplicate email:  409 Conflict { success: false, message }
   --------------------------------------------------------------------------- */
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;

    // ── Validate ObjectId ────────────────────────────────────────────────────
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success : false,
        message : 'Invalid user ID format. Please provide a valid MongoDB ObjectId.'
      });
    }

    // ── Extract only allowed update fields ───────────────────────────────────
    // Prevents mass-assignment — clients cannot update _id, __v, createdAt, etc.
    const { name, email, role } = req.body;
    const updates = {};
    if (name  !== undefined) updates.name  = name;
    if (email !== undefined) updates.email = email;
    if (role  !== undefined) updates.role  = role;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success : false,
        message : 'No valid fields provided for update. Allowed: name, email, role.'
      });
    }

    // ── findByIdAndUpdate with runValidators: true ───────────────────────────
    // runValidators: true ensures Mongoose schema validation runs on update.
    // new: true returns the updated document instead of the old one.
    const updated = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success : false,
        message : 'User not found.'
      });
    }

    return res.status(200).json({
      success : true,
      message : 'User updated successfully.',
      data    : updated
    });

  } catch (err) {
    // Duplicate email during update → errorHandler.js → 409
    next(err);
  }
}

/* ---------------------------------------------------------------------------
   DELETE /api/users/:id
   Removes a user from MongoDB permanently.

   Success:    200 OK       { success, message }
   Invalid ID: 400 Bad Req. { success: false, message }
   Not found:  404 Not Found { success: false, message }
   --------------------------------------------------------------------------- */
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    // ── Validate ObjectId ────────────────────────────────────────────────────
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success : false,
        message : 'Invalid user ID format. Please provide a valid MongoDB ObjectId.'
      });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success : false,
        message : 'User not found.'
      });
    }

    return res.status(200).json({
      success : true,
      message : 'User deleted successfully.',
      data    : { id }
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser : createUserHandler,
  updateUser,
  deleteUser
};
