/* =============================================================================
   controllers/contactController.js
   Business logic for the /api/contact endpoints.
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Upgraded from Project 2 (in-memory, sync) to MongoDB + Mongoose (async).
   Contact form submissions are now stored persistently in the database.

   Operations:
     ✓ POST /api/contact — validates & saves to MongoDB       (201)
     ✓ GET  /api/contact — retrieves all submissions          (200)
   ============================================================================= */

const Contact = require('../models/contactModel');

// ── Utility validators ─────────────────────────────────────────────────────────

/**
 * isValidEmail – basic email format check.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * isValidPhone – accepts common international phone formats.
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
}

// ── Controller Methods ─────────────────────────────────────────────────────────

/* ---------------------------------------------------------------------------
   POST /api/contact
   Validates the request body, stores the contact message in MongoDB.

   Success:          201 Created  { success, message, data: contact }
   Validation error: 400 Bad Req. { success: false, message, errors }
   --------------------------------------------------------------------------- */
async function submitContact(req, res, next) {
  try {
    const { name, email, phone, message } = req.body;

    // ── Application-level validation ─────────────────────────────────────────
    // Runs before the DB operation to give clear, field-level error feedback.
    const errors = {};

    if (!name || name.trim() === '') {
      errors.name = 'Name is required.';
    }

    if (!email || !isValidEmail(email)) {
      errors.email = 'A valid email address is required.';
    }

    if (!phone || !isValidPhone(phone)) {
      errors.phone = 'A valid phone number is required (e.g. +92 300 1234567).';
    }

    if (!message || message.trim() === '') {
      errors.message = 'Message is required.';
    } else if (message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success : false,
        message : 'Validation failed. Please correct the highlighted fields.',
        errors
      });
    }

    // ── Persist to MongoDB via Mongoose ──────────────────────────────────────
    // Contact.create() is equivalent to new Contact(data).save()
    // Schema-level validators run here as a second defence layer.
    const saved = await Contact.create({ name, email, phone, message });

    return res.status(201).json({
      success : true,
      message : 'Message sent successfully! A NovaMind AI specialist will contact you shortly.',
      data    : saved
    });

  } catch (err) {
    // Mongoose ValidationError handled by errorHandler.js → 400
    next(err);
  }
}

/* ---------------------------------------------------------------------------
   GET /api/contact
   Returns all contact submissions from MongoDB, newest first.

   Success: 200 OK  { success, count, data: [ ...contacts ] }
   --------------------------------------------------------------------------- */
async function getContacts(req, res, next) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success : true,
      count   : contacts.length,
      data    : contacts
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact, getContacts };
