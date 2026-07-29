/* =============================================================================
   models/authModel.js
   Dummy credentials store for demo / internship-portfolio authentication.
   ⚠️  NOT intended for production.  Replace with hashed DB look-ups (bcrypt).
   ============================================================================= */

/**
 * DUMMY_USERS – hardcoded user records used for login demonstration.
 * Password field would be a bcrypt hash in a real application.
 */
const DUMMY_USERS = [
  {
    id      : 1,
    name    : 'Admin User',
    email   : 'admin@novamind.ai',
    password: 'admin123',           // Plain-text only for demo purposes
    role    : 'admin'
  },
  {
    id      : 2,
    name    : 'Demo User',
    email   : 'demo@novamind.ai',
    password: 'demo1234',
    role    : 'user'
  }
];

/**
 * findUserByEmail – looks up a user by email address (case-insensitive).
 *
 * @param {string} email
 * @returns {Object|undefined}
 */
function findUserByEmail(email) {
  return DUMMY_USERS.find(u => u.email === email.trim().toLowerCase());
}

/**
 * validatePassword – naive plain-text comparison (demo only).
 * In production, use bcrypt.compare() here.
 *
 * @param {string} inputPassword   - Password submitted by the user
 * @param {string} storedPassword  - Password stored in the "database"
 * @returns {boolean}
 */
function validatePassword(inputPassword, storedPassword) {
  return inputPassword === storedPassword;
}

module.exports = { findUserByEmail, validatePassword };
