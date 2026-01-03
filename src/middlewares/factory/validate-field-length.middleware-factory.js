const { validateLength } = require("@utils/validators-factory.util");
const { throwBadRequestError, getLogIdentifiers } = require("@utils/error-handler.util");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * 🏭 Field Length Validation Middleware Factory
 * 
 * Validates string field length against min/max constraints
 * Auto-generates smart error messages
 * 
 * @param {Object} config - Length validation configuration
 * @param {string} config.field - Name of the field to validate
 * @param {number} config.min - Minimum length (optional)
 * @param {number} config.max - Maximum length (optional)
 * @param {boolean} config.required - Is field required? (default: true)
 * @returns {Function} Express middleware
 * 
 * @example
 * // Exact length
 * validateFieldLength({ field: 'otp', min: 6, max: 6 })
 * 
 * @example
 * // Range
 * validateFieldLength({ field: 'password', min: 8, max: 50 })
 * 
 * @example
 * // Only max
 * validateFieldLength({ field: 'bio', max: 500, required: false })
 */
const validateFieldLength = (config) => {
  const { field, min = 0, max = Infinity, required = true } = config;

  return (req, res, next) => {
    try {
      const value = req.body[field];

      // Check if field exists
      if (required && (value === undefined || value === null)) {
        logWithTime(`⚠️ [validateFieldLength] Missing required field: ${field} ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, `${field} is required`);
      }

      // Skip validation if optional and not provided
      if (!required && (value === undefined || value === null)) {
        return next();
      }

      // Validate only strings
      if (typeof value !== 'string') {
        logWithTime(`⚠️ [validateFieldLength] Field ${field} is not a string ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, `${field} must be a string`);
      }

      // Validate length
      if (!validateLength(value, min, max)) {
        logWithTime(`⚠️ [validateFieldLength] Invalid length for ${field} ${getLogIdentifiers(req)}`);
        
        // Smart error message
        let message;
        if (min === max) {
          message = `${field} must be exactly ${min} characters`;
        } else if (min > 0 && max < Infinity) {
          message = `${field} must be between ${min} and ${max} characters`;
        } else if (min > 0) {
          message = `${field} must be at least ${min} characters`;
        } else {
          message = `${field} must not exceed ${max} characters`;
        }
        
        return throwBadRequestError(res, message);
      }

      logWithTime(`✅ [validateFieldLength] Field ${field} length valid`);
      next();
    } catch (error) {
      logWithTime(`❌ [validateFieldLength] Error: ${error.message} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, error.message);
    }
  };
};

module.exports = { validateFieldLength };
