/* =============================================================================
   controllers/newsletterController.js
   Business logic for the /newsletter endpoints.
   Validates email, prevents duplicates, stores subscriber.
   ============================================================================= */

const {
  emailExists,
  addSubscriber,
  getAllSubscribers
} = require('../models/newsletterModel');

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
 * subscribe – POST /newsletter
 * Validates the email, blocks duplicates, stores the new subscriber.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function subscribe(req, res, next) {
  try {
    const { email } = req.body;

    // ── Validate Presence ───────────────────────────────────────────────────
    if (!email || email.trim() === '') {
      return res.status(400).json({
        success : false,
        message : 'Email address is required.'
      });
    }

    // ── Validate Format ─────────────────────────────────────────────────────
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success : false,
        message : 'Please provide a valid email address.'
      });
    }

    // ── Duplicate Check ─────────────────────────────────────────────────────
    if (emailExists(email)) {
      return res.status(409).json({
        success : false,
        message : 'This email is already subscribed to the NovaMind AI newsletter.'
      });
    }

    // ── Store & Respond ─────────────────────────────────────────────────────
    const saved = addSubscriber(email);

    return res.status(201).json({
      success : true,
      message : 'You have successfully subscribed to the NovaMind AI newsletter!',
      data    : saved
    });

  } catch (err) {
    next(err);
  }
}

/**
 * getSubscribers – GET /newsletter
 * Returns the full list of newsletter subscribers.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function getSubscribers(req, res, next) {
  try {
    const all = getAllSubscribers();

    return res.status(200).json({
      success : true,
      count   : all.length,
      data    : all
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe, getSubscribers };
