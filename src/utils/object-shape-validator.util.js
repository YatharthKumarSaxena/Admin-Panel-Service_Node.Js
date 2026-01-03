/**
 * ✅ Pure Validation Function (Industry Standard)
 * Returns validation result object, NO response handling
 * Middleware handles logging and HTTP responses
 * 
 * @param {Object} obj - Object to validate
 * @param {Array<string>} requiredFields - Expected field names
 * @param {string} label - Label for error messages (e.g., "access token", "refresh token")
 * @returns {Object} { valid: boolean, missing: Array<string>, extra: Array<string> }
 */
const validateObjectShape = (obj, requiredFields, label) => {
  const keys = Object.keys(obj);
  const missing = requiredFields.filter(f => !keys.includes(f));
  const extra = keys.filter(f => !requiredFields.includes(f));

  return {
    valid: missing.length === 0 && extra.length === 0,
    missing,
    extra,
    label
  };
};

module.exports = { validateObjectShape };
