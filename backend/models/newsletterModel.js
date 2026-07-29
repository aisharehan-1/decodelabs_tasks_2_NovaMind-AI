/* =============================================================================
   models/newsletterModel.js
   Mongoose schema and model for the Newsletter Subscriber resource.
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Replaces the Project 2 in-memory subscribers array.
   The unique index on email is enforced at the database level by MongoDB,
   preventing duplicate subscriptions even under concurrent requests.

   Collection name (auto-derived): "newsletters"
   ============================================================================= */

const mongoose = require('mongoose');

/* ── Schema Definition ─────────────────────────────────────────────────────── */

const newsletterSchema = new mongoose.Schema(
  {
    // ── Email ─────────────────────────────────────────────────────────────────
    // unique: true → MongoDB creates a unique index on this field.
    // Attempting to insert a duplicate email throws MongoServerError code 11000.
    email: {
      type     : String,
      required : [true, 'Email address is required.'],
      unique   : true,          // Database-level unique constraint
      lowercase: true,          // Normalise before saving
      trim     : true,
      match    : [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address.'
      ]
    },

    // ── Subscribed At ─────────────────────────────────────────────────────────
    subscribedAt: {
      type   : Date,
      default: Date.now
    }
  },
  {
    timestamps: false // subscribedAt covers the creation timestamp
  }
);

/* ── toJSON transform ──────────────────────────────────────────────────────── */
newsletterSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

/* ── Model ─────────────────────────────────────────────────────────────────── */
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
