/* =============================================================================
   middleware/requestLogger.js
   Custom request logging middleware.
   Prints method, URL, HTTP status code, and response time on every request.
   ============================================================================= */

/**
 * requestLogger – Express middleware that logs each HTTP request.
 *
 * Output format:
 *   [2026-07-11T16:30:00.000Z] POST /contact 201 12ms
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next - passes control to the next middleware
 */
function requestLogger(req, res, next) {
  const start = Date.now(); // Capture start time before the handler runs

  // Hook into the 'finish' event – fires once the response has been sent
  res.on('finish', () => {
    const duration  = Date.now() - start;   // ms elapsed
    const timestamp = new Date().toISOString();
    const method    = req.method;
    const url       = req.originalUrl;
    const status    = res.statusCode;

    // Colour-code the method for readability in terminals that support ANSI
    const methodColour = {
      GET    : '\x1b[32m',  // Green
      POST   : '\x1b[34m',  // Blue
      PUT    : '\x1b[33m',  // Yellow
      DELETE : '\x1b[31m',  // Red
      PATCH  : '\x1b[35m'   // Magenta
    }[method] || '\x1b[37m'; // Default white

    const reset  = '\x1b[0m';

    // Status-code colour
    const statusColour = status >= 500
      ? '\x1b[31m'           // Red  (5xx)
      : status >= 400
        ? '\x1b[33m'         // Yellow (4xx)
        : '\x1b[32m';        // Green  (2xx/3xx)

    console.log(
      `[${timestamp}] ${methodColour}${method}${reset} ${url} ` +
      `${statusColour}${status}${reset} ${duration}ms`
    );
  });

  next(); // Hand off to the next middleware / route handler
}

module.exports = requestLogger;
