/* =============================================================================
   models/newsletterModel.js
   In-memory data store for newsletter subscribers.
   Duplicate email prevention is enforced here at the model layer.
   ============================================================================= */

/**
 * subscribers – in-memory list of newsletter email subscriptions.
 */
const subscribers = [];

/**
 * emailExists – checks whether a given email is already subscribed.
 *
 * @param {string} email - Email to look up (case-insensitive)
 * @returns {boolean}
 */
function emailExists(email) {
  const normalised = email.trim().toLowerCase();
  return subscribers.some(sub => sub.email === normalised);
}

/**
 * addSubscriber – creates and stores a new newsletter subscriber.
 *
 * @param {string} email - Validated, unique email address
 * @returns {Object}     - The newly created subscriber record
 */
function addSubscriber(email) {
  const newSubscriber = {
    id          : subscribers.length + 1,
    email       : email.trim().toLowerCase(),
    subscribedAt: new Date().toISOString()
  };

  subscribers.push(newSubscriber);
  return newSubscriber;
}

/**
 * getAllSubscribers – retrieves all newsletter subscribers.
 *
 * @returns {Array}
 */
function getAllSubscribers() {
  return subscribers;
}

module.exports = { emailExists, addSubscriber, getAllSubscribers };
