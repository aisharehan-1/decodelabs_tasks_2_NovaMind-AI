/* =============================================================================
   middleware/errorHandler.js
   Global error-handling middleware.
   Project 3: Database Integration | DecodeLabs Industrial Training 2026

   Extended from Project 2 to handle MongoDB and Mongoose-specific errors:
     • Mongoose ValidationError   → 400 Bad Request
     • MongoDB Duplicate Key      → 409 Conflict  (unique constraint violation)
     • Mongoose CastError         → 400 Bad Request (invalid ObjectId)

   Must be the LAST middleware registered in server.js (4-argument signature).
   ============================================================================= */

/**
 * errorHandler – catches all errors forwarded via next(err) and returns
 * a clean, consistent JSON response. Never leaks internal stack traces
 * or database credentials to the client.
 *
 * @param {Error}                      err
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next  - required 4th param for Express to
 *                                            recognise this as an error handler
 */
function errorHandler(err, req, res, next) {  // eslint-disable-line no-unused-vars

  // ── Log full error internally (server-side only) ──────────────────────────
  console.error('\x1b[31m[ERROR]\x1b[0m', err.stack || err.message);

  // ── Mongoose ValidationError ──────────────────────────────────────────────
  // Thrown when schema validators (required, minlength, enum, match) fail.
  if (err.name === 'ValidationError') {
    // Collect all field-level validation messages into a single object
    const errors = {};
    Object.keys(err.errors).forEach(field => {
      errors[field] = err.errors[field].message;
    });

    return res.status(400).json({
      success : false,
      message : 'Validation failed. Please check the submitted data.',
      errors
    });
  }

  // ── MongoDB Duplicate Key Error (code 11000) ──────────────────────────────
  // Thrown when a unique index constraint is violated (e.g. duplicate email).
  // This is the database-level enforcement of the unique constraint.
  if (err.code === 11000) {
    // Extract the duplicate field name from the error key pattern
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';

    return res.status(409).json({
      success : false,
      message : `A record with this ${duplicateField} already exists.`
    });
  }

  // ── Mongoose CastError ────────────────────────────────────────────────────
  // Thrown when Mongoose cannot cast a value to the expected type.
  // Most common cause: invalid MongoDB ObjectId in URL params.
  if (err.name === 'CastError') {
    return res.status(400).json({
      success : false,
      message : `Invalid value for field "${err.path}". Please check the format.`
    });
  }

  // ── Generic / Unexpected Error ────────────────────────────────────────────
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success : false,
    message : err.message || 'An internal server error occurred. Please try again later.',
    // Stack trace only visible in development — never exposed in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
