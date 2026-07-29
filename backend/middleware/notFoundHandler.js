/* =============================================================================
   middleware/notFoundHandler.js
   404 catch-all middleware.
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Updated from Project 2: added PUT and DELETE endpoints to the
   availableEndpoints documentation block.

   Must be registered AFTER all routes but BEFORE errorHandler in server.js.
   ============================================================================= */

/**
 * notFoundHandler – returns a 404 JSON response for any request that did not
 * match a defined route.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function notFoundHandler(req, res, next) { // eslint-disable-line no-unused-vars
  res.status(404).json({
    success : false,
    message : `API endpoint not found: [${req.method}] ${req.originalUrl}`,
    hint    : 'Please check the API documentation and use a valid endpoint.',
    availableEndpoints: {
      'GET    /api/health'        : 'API health check + database status',
      'GET    /api/users'         : 'List all users (from MongoDB)',
      'POST   /api/users'         : 'Create a new user',
      'GET    /api/users/:id'     : 'Get a user by MongoDB ObjectId',
      'PUT    /api/users/:id'     : 'Update an existing user',
      'DELETE /api/users/:id'     : 'Delete a user from MongoDB',
      'GET    /api/contact'       : 'List all contact submissions',
      'POST   /api/contact'       : 'Submit a contact form',
      'GET    /api/newsletter'    : 'List all newsletter subscribers',
      'POST   /api/newsletter'    : 'Subscribe to the newsletter',
      'POST   /api/login'         : 'Authenticate a user'
    }
  });
}

module.exports = notFoundHandler;
