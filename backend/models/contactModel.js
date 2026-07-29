/* =============================================================================
   models/contactModel.js
   Mongoose schema and model for the Contact resource.
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Replaces the Project 2 in-memory contacts array.
   Submitted contact form data is now stored persistently in MongoDB.

   Collection name (auto-derived): "contacts"
   ============================================================================= */

const mongoose = require('mongoose');

/* ── Schema Definition ─────────────────────────────────────────────────────── */

const contactSchema = new mongoose.Schema(
  {
    // ── Name ─────────────────────────────────────────────────────────────────
    name: {
      type     : String,
      required : [true, 'Name is required.'],
      trim     : true,
      minlength: [2,    'Name must be at least 2 characters long.'],
      maxlength: [100,  'Name must not exceed 100 characters.']
    },

    // ── Email ─────────────────────────────────────────────────────────────────
    email: {
      type    : String,
      required: [true, 'Email address is required.'],
      lowercase: true,
      trim    : true,
      match   : [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address.'
      ]
    },

    // ── Phone ─────────────────────────────────────────────────────────────────
    phone: {
      type    : String,
      required: [true, 'Phone number is required.'],
      trim    : true
    },

    // ── Message ───────────────────────────────────────────────────────────────
    message: {
      type     : String,
      required : [true, 'Message is required.'],
      trim     : true,
      minlength: [10,   'Message must be at least 10 characters long.'],
      maxlength: [2000, 'Message must not exceed 2000 characters.']
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

/* ── toJSON transform ──────────────────────────────────────────────────────── */
contactSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

/* ── Model ─────────────────────────────────────────────────────────────────── */
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
