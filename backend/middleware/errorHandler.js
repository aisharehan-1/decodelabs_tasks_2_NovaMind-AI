/* =============================================================================
   middleware/errorHandler.js
   Global error-handling middleware.
   Catches errors forwarded via next(err) from any route or controller.
   Must be the LAST middleware registered in server.js (4-argument signature).
   ============================================================================= */

/**
 * errorHandler – catches unhandled runtime errors and returns a clean JSON
 * response instead of crashing or leaking a stack trace to the client.
 *
 * @param {Error}                      err
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next  - required as 4th param so Express
 *                                            identifies this as an error handler
 */
function errorHandler(err, req, res, next) {  // eslint-disable-line no-unused-vars
  // Log the full error stack on the server for debugging
  console.error('\x1b[31m[ERROR]\x1b[0m', err.stack || err.message);

  // Determine HTTP status – use err.status if set by the thrower, else 500
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success : false,
    message : err.message || 'An internal server error occurred. Please try again later.',
    // Only include stack trace in development to avoid leaking internals
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
