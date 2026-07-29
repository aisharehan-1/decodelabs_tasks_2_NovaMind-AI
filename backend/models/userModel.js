/* =============================================================================
   models/userModel.js
   Mongoose schema and model for the User resource.
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Replaces the Project 2 in-memory array with a real MongoDB collection.
   All data written through this model persists across server restarts.

   Collection name (auto-derived by Mongoose): "users"
   ============================================================================= */

const mongoose = require('mongoose');

/* ── Schema Definition ─────────────────────────────────────────────────────────
   Each field includes type, validation, and constraints.
   Mongoose enforces these rules at the application layer before hitting MongoDB.
   The database-level unique index on email is enforced by MongoDB itself.
   ──────────────────────────────────────────────────────────────────────────── */

const userSchema = new mongoose.Schema(
  {
    // ── Name ────────────────────────────────────────────────────────────────
    name: {
      type    : String,
      required: [true, 'Name is required.'],
      trim    : true,
      minlength: [2,   'Name must be at least 2 characters long.'],
      maxlength: [100, 'Name must not exceed 100 characters.']
    },

    // ── Email ───────────────────────────────────────────────────────────────
    // unique: true creates a MongoDB unique index → database-level constraint.
    // Duplicate inserts will throw a MongoServerError with code 11000.
    email: {
      type     : String,
      required : [true, 'Email address is required.'],
      unique   : true,          // Database-level unique constraint
      lowercase: true,          // Normalise to lowercase before saving
      trim     : true,
      match    : [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address.'
      ]
    },

    // ── Role ─────────────────────────────────────────────────────────────────
    // Enum validation — only 'user' or 'admin' are accepted values.
    // This is a database-level check constraint equivalent.
    role: {
      type   : String,
      enum   : {
        values : ['user', 'admin'],
        message: 'Role must be either "user" or "admin".'
      },
      default: 'user'
    }
  },
  {
    // ── Timestamps ──────────────────────────────────────────────────────────
    // Mongoose automatically adds createdAt and updatedAt fields.
    timestamps: true
  }
);

/* ── Virtual: toJSON transform ─────────────────────────────────────────────────
   Renames _id → id and removes __v from API responses for cleaner output.
   ──────────────────────────────────────────────────────────────────────────── */
userSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

/* ── Model ─────────────────────────────────────────────────────────────────────
   mongoose.model() creates or retrieves the compiled model.
   The model name 'User' maps to the 'users' MongoDB collection.
   ──────────────────────────────────────────────────────────────────────────── */
const User = mongoose.model('User', userSchema);

module.exports = User;
