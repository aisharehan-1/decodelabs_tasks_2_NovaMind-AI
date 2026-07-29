/* =============================================================================
   controllers/contactController.js
   Business logic for the /contact endpoints.
   Validates input → delegates to model → returns JSON response.
   ============================================================================= */

const { addContact, getAllContacts } = require('../models/contactModel');

// ── Utility: email & phone validators ─────────────────────────────────────────

/**
 * isValidEmail – checks if a string is a well-formed email address.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * isValidPhone – accepts common international phone formats.
 * Examples: +1 (555) 000-0000, 03001234567, +923001234567
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
}

// ── Controller Methods ─────────────────────────────────────────────────────────

/**
 * submitContact – POST /contact
 * Validates the request body, stores the message, returns JSON.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next  - passes errors to errorHandler
 */
function submitContact(req, res, next) {
  try {
    const { name, email, phone, message } = req.body;

    // ── Field-level Validation ──────────────────────────────────────────────
    const errors = {};

    if (!name || name.trim() === '') {
      errors.name = 'Name is required.';
    }

    if (!email || !isValidEmail(email)) {
      errors.email = 'A valid email address is required.';
    }

    if (!phone || !isValidPhone(phone)) {
      errors.phone = 'A valid phone number is required (e.g. +1 555 000 0000).';
    }

    if (!message || message.trim() === '') {
      errors.message = 'Message is required.';
    }

    // Return 400 with field-level error map if validation fails
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success : false,
        message : 'Validation failed. Please correct the highlighted fields.',
        errors
      });
    }

    // ── Store & Respond ────────────────────────────────────────────────────
    const saved = addContact({ name, email, phone, message });

    return res.status(201).json({
      success : true,
      message : 'Message sent successfully! A NovaMind AI specialist will contact you shortly.',
      data    : saved
    });

  } catch (err) {
    // Forward unexpected errors to the global error-handling middleware
    next(err);
  }
}

/**
 * getContacts – GET /contact
 * Returns all stored contact submissions as JSON.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function getContacts(req, res, next) {
  try {
    const all = getAllContacts();

    return res.status(200).json({
      success : true,
      count   : all.length,
      data    : all
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact, getContacts };
