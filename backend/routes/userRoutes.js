/* =============================================================================
   routes/userRoutes.js
   RESTful routes for the /api/users resource.
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Upgraded from Project 2: added PUT /:id and DELETE /:id routes to
   complete the full CRUD surface.

   Full CRUD mapping:
     CREATE → POST   /api/users       → userController.createUser
     READ   → GET    /api/users       → userController.getUsers
     READ   → GET    /api/users/:id   → userController.getUserById
     UPDATE → PUT    /api/users/:id   → userController.updateUser
     DELETE → DELETE /api/users/:id   → userController.deleteUser
   ============================================================================= */

const express = require('express');
const router  = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

/**
 * GET  /api/users  → List all users (from MongoDB)
 * POST /api/users  → Create a new user (persisted to MongoDB)
 */
router.get('/',  getUsers);
router.post('/', createUser);

/**
 * GET    /api/users/:id  → Return one user by MongoDB ObjectId
 * PUT    /api/users/:id  → Update an existing user
 * DELETE /api/users/:id  → Remove a user from MongoDB
 */
router.get('/:id',    getUserById);
router.put('/:id',    updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
