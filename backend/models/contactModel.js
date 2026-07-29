/* =============================================================================
   models/contactModel.js
   In-memory data store for contact form submissions.
   Acts as a lightweight "database" during development (no DB required).
   ============================================================================= */

/**
 * contacts – temporary in-memory array that holds all contact submissions.
 * Data persists only while the server process is running.
 * Replace with a real DB (MongoDB / PostgreSQL) for production use.
 */
const contacts = [];

/**
 * addContact – appends a new contact entry to the in-memory store.
 *
 * @param {Object} data  - Validated contact data: { name, email, phone, message }
 * @returns {Object}     - The newly created contact record (with id & timestamp)
 */
function addContact(data) {
  const newContact = {
    id        : contacts.length + 1,               // Simple auto-increment ID
    name      : data.name.trim(),
    email     : data.email.trim().toLowerCase(),
    phone     : data.phone.trim(),
    message   : data.message.trim(),
    createdAt : new Date().toISOString()            // ISO 8601 timestamp
  };

  contacts.push(newContact);
  return newContact;
}

/**
 * getAllContacts – retrieves every stored contact submission.
 *
 * @returns {Array} - Array of contact objects (newest last)
 */
function getAllContacts() {
  return contacts;
}

module.exports = { addContact, getAllContacts };
