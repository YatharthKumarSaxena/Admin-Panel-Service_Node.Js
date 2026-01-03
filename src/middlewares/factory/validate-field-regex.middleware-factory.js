const { isValidRegex } = require("@utils/validators-factory.util");
const { throwBadRequestError, getLogIdentifiers } = require("@utils/error-handler.util");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * 🏭 Field Regex Validation Middleware Factory
 * 
 * Validates field against regex pattern
 * 
 * @param {Object} config - Regex validation configuration
 * @param {string} config.field - Name of the field to validate
 * @param {RegExp} config.regex - Regex pattern to match
 * @param {string} config.message - Custom error message (optional)
 * @param {boolean} config.required - Is field required? (default: true)
 * @returns {Function} Express middleware
 * 
 * @example
 * // Email validation
 * validateFieldRegex({ 
 *   field: 'email', 
 *   regex: emailRegex,
 *   message: 'Invalid email format'
 * })
 * 
 * @example
 * // Custom ID format
 * validateFieldRegex({ 
 *   field: 'adminId', 
 *   regex: /^ADM-\d{10}$/,
 *   message: 'Admin ID must be in format ADM-XXXXXXXXXX'
 * })
 */
const validateFieldRegex = (config) => {
  const { field, regex, message, required = true } = config;

  return (req, res, next) => {
    try {
      const value = req.body[field];

      // Check if field exists
      if (required && (value === undefined || value === null)) {
        logWithTime(`⚠️ [validateFieldRegex] Missing required field: ${field} ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, `${field} is required`);
      }

      // Skip validation if optional and not provided
      if (!required && (value === undefined || value === null)) {
        return next();
      }

      // Validate only strings
      if (typeof value !== 'string') {
        logWithTime(`⚠️ [validateFieldRegex] Field ${field} is not a string ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, `${field} must be a string`);
      }

      // Validate regex pattern
      if (!isValidRegex(value, regex)) {
        logWithTime(`⚠️ [validateFieldRegex] Invalid format for ${field} ${getLogIdentifiers(req)}`);
        const errorMessage = message || `${field} format is invalid`;
        return throwBadRequestError(res, errorMessage);
      }

      logWithTime(`✅ [validateFieldRegex] Field ${field} format valid`);
      next();
    } catch (error) {
      logWithTime(`❌ [validateFieldRegex] Error: ${error.message} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, error.message);
    }
  };
};

module.exports = { validateFieldRegex };
