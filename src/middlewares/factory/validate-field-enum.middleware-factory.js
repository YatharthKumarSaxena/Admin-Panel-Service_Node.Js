const { isValidEnumValue } = require("@utils/validators-factory.util");
const { throwBadRequestError, getLogIdentifiers } = require("@utils/error-handler.util");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * 🏭 Field Enum Validation Middleware Factory
 * 
 * Validates field against enum values
 * Now supports enum helpers that return boolean
 * 
 * @param {Object} config - Enum validation configuration
 * @param {string} config.field - Name of the field to validate
 * @param {Object|Function} config.enum - Enum object OR enum helper with validate()
 * @param {string} config.message - Custom error message (optional)
 * @param {boolean} config.required - Is field required? (default: true)
 * @returns {Function} Express middleware
 * 
 * @example
 * // Direct enum object
 * validateFieldEnum({ 
 *   field: 'adminType', 
 *   enum: AdminType
 * })
 * 
 * @example
 * // Using enum helper
 * validateFieldEnum({ 
 *   field: 'blockReason', 
 *   enum: BlockReasonHelper
 * })
 */
const validateFieldEnum = (config) => {
  const { field, enum: enumConfig, message, required = true } = config;

  return (req, res, next) => {
    try {
      const value = req.body[field];

      // Check if field exists
      if (required && (value === undefined || value === null)) {
        logWithTime(`⚠️ [validateFieldEnum] Missing required field: ${field} ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, `${field} is required`);
      }

      // Skip validation if optional and not provided
      if (!required && (value === undefined || value === null)) {
        return next();
      }

      // Check if it's an enum helper (has validate method)
      const isEnumHelper = enumConfig && typeof enumConfig.validate === 'function';
      let isValid = false;
      let allowedValues = [];
      let enumName = field;

      if (isEnumHelper) {
        // Use enum helper
        isValid = enumConfig.validate(value);
        allowedValues = enumConfig.getValidValues ? enumConfig.getValidValues() : [];
        enumName = enumConfig.getName ? enumConfig.getName() : field;
      } else {
        // Direct enum object
        isValid = isValidEnumValue(enumConfig, value);
        allowedValues = Object.values(enumConfig);
      }

      // Validate against enum
      if (!isValid) {
        logWithTime(`⚠️ [validateFieldEnum] Invalid value for ${field}: ${value} ${getLogIdentifiers(req)}`);
        
        const allowedValuesStr = allowedValues.join(', ');
        const errorMessage = message || `${field} must be one of: ${allowedValuesStr}`;
        
        return throwBadRequestError(res, errorMessage);
      }

      logWithTime(`✅ [validateFieldEnum] Field ${field} enum valid`);
      next();
    } catch (error) {
      logWithTime(`❌ [validateFieldEnum] Error: ${error.message} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, error.message);
    }
  };
};

module.exports = { validateFieldEnum };
