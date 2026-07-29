/* =============================================================================
   routes/userRoutes.js
   Defines RESTful routes for the /api/users resource.

   RESTful naming rule: Resources are nouns. HTTP methods are the verbs.
     GET    /api/users      → list all users
     POST   /api/users      → create a new user
     GET    /api/users/:id  → get a specific user by ID
   ============================================================================= */

const express = require('express');
const router  = express.Router();

const {
  getUsers,
  getUserById,
  createUser
} = require('../controllers/userController');

/**
 * GET  /api/users  → Return all users
 * POST /api/users  → Create a new user
 */
router.get('/',  getUsers);
router.post('/', createUser);

/**
 * GET /api/users/:id  → Return one user by ID
 */
router.get('/:id', getUserById);

module.exports = router;
