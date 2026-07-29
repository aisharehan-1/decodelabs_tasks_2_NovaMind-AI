/* =============================================================================
   routes/newsletterRoutes.js
   Maps HTTP verbs + paths to the newsletterController methods.
   ============================================================================= */

const express = require('express');
const router  = express.Router();

const { subscribe, getSubscribers } = require('../controllers/newsletterController');

/**
 * GET  /newsletter  → Retrieve all newsletter subscribers
 * POST /newsletter  → Subscribe a new email address
 */
router.get('/',  getSubscribers);
router.post('/', subscribe);

module.exports = router;
