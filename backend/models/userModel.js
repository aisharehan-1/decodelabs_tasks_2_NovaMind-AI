/* =============================================================================
   models/userModel.js
   In-memory data store for registered users.
   Demonstrates Project 2 concept: simple in-memory storage using a plain array.
   No database required — data persists while the server process is running.
   ============================================================================= */

/**
 * users – the in-memory array that holds all registered user records.
 * In a real application this would be replaced by a database (MongoDB, PostgreSQL, etc.)
 *
 * Example entry:
 * {
 *   id: 1,
 *   name: "Aisha",
 *   email: "aisha@example.com",
 *   createdAt: "2026-07-29T01:00:00.000Z"
 * }
 */
let users = [];

/**
 * getAllUsers – returns the full list of users.
 *
 * @returns {Array} - Array of all user objects
 */
function getAllUsers() {
  return users;
}

/**
 * findUserById – finds a single user by their numeric ID.
 *
 * @param {number} id - The user's ID
 * @returns {Object|undefined} - The user object, or undefined if not found
 */
function findUserById(id) {
  return users.find(u => u.id === id);
}

/**
 * emailExists – checks whether an email address is already registered.
 * Comparison is case-insensitive.
 *
 * @param {string} email - Email address to check
 * @returns {boolean}
 */
function emailExists(email) {
  const normalised = email.trim().toLowerCase();
  return users.some(u => u.email === normalised);
}

/**
 * createUser – adds a new user to the in-memory store.
 *
 * @param {Object} data - Must contain { name, email }
 * @returns {Object} - The newly created user record (with id & createdAt)
 */
function createUser(data) {
  const newUser = {
    id        : users.length + 1,                  // Simple auto-increment ID
    name      : data.name.trim(),
    email     : data.email.trim().toLowerCase(),
    createdAt : new Date().toISOString()            // ISO 8601 timestamp
  };

  users.push(newUser);
  return newUser;
}

module.exports = { getAllUsers, findUserById, emailExists, createUser };
