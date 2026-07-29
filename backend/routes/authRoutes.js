/* =============================================================================
   routes/authRoutes.js
   Maps HTTP verbs + paths to the authController methods.
   ============================================================================= */

const express = require('express');
const router  = express.Router();

const { login } = require('../controllers/authController');

/**
 * POST /login  → Authenticate a user with email + password
 */
router.post('/', login);

module.exports = router;
