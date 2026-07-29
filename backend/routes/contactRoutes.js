/* =============================================================================
   routes/contactRoutes.js
   Maps HTTP verbs + paths to the contactController methods.
   ============================================================================= */

const express = require('express');
const router  = express.Router();

const { submitContact, getContacts } = require('../controllers/contactController');

/**
 * GET  /contact  → Retrieve all contact form submissions
 * POST /contact  → Submit a new contact message
 */
router.get('/',  getContacts);
router.post('/', submitContact);

module.exports = router;
