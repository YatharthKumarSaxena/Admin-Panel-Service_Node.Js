const { logWithTime } = require("../../configs/system.config");
const { getLogIdentifiers } = require("../../utils/log-identifiers.util");
const { throwBadRequestError } = require("../../utils/error-handler.util");

/**
 * 🏭 Multiple Enum Validation Middleware Factory
 * 
 * Validates multiple enum fields and collects all errors before responding
 * Works with enum helpers that return boolean
 * 
 * @param {Array<Object>} enumConfigs - Array of enum validation configurations
 * @param {string} enumConfigs[].field - Name of the field to validate
 * @param {Object|Function} enumConfigs[].enum - Enum object OR enum helper with validate()
 * @param {boolean} enumConfigs[].required - Is field required? (default: true)
 * @returns {Function} Express middleware
 * 
 * @example
 * // Validate multiple enums at once
 * validateMultipleEnums([
 *   { field: 'adminType', enum: AdminTypeHelper, required: true },
 *   { field: 'blockReason', enum: BlockReasonHelper, required: false },
 *   { field: 'status', enum: StatusHelper, required: true }
 * ])
 * 
 * // Returns error like:
 * // "adminType must be one of: SUPER_ADMIN, MID_ADMIN, LOW_ADMIN. blockReason must be one of: SUSPICIOUS_ACTIVITY, POLICY_VIOLATION"
 */
const validateMultipleEnums = (enumConfigs) => {
  return (req, res, next) => {
    try {
      const errors = [];

      // Validate each enum field
      for (const config of enumConfigs) {
        const { field, enum: enumConfig, required = true } = config;
        const value = req.body[field];

        // Check if field exists
        if (required && (value === undefined || value === null)) {
          errors.push(`${field} is required`);
          continue;
        }

        // Skip validation if optional and not provided
        if (!required && (value === undefined || value === null)) {
          continue;
        }

        // Check if it's an enum helper (has validate method)
        const isEnumHelper = enumConfig && typeof enumConfig.validate === 'function';
        let isValid = false;
        let allowedValues = [];

        if (isEnumHelper) {
          // Use enum helper
          isValid = enumConfig.validate(value);
          allowedValues = enumConfig.getValidValues ? enumConfig.getValidValues() : [];
        } else {
          // Direct enum object
          const { isValidEnumValue } = require("../../utils/validators-factory.util");
          isValid = isValidEnumValue(enumConfig, value);
          allowedValues = Object.values(enumConfig);
        }

        // Collect error if invalid
        if (!isValid) {
          const allowedValuesStr = allowedValues.join(', ');
          errors.push(`${field} must be one of: ${allowedValuesStr}`);
        }
      }

      // If any errors, return all at once
      if (errors.length > 0) {
        const errorMessage = errors.join('. ');
        logWithTime(`⚠️ [validateMultipleEnums] Multiple enum validation errors: ${errors.length} ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, errorMessage);
      }

      logWithTime(`✅ [validateMultipleEnums] All enum fields valid`);
      next();
    } catch (error) {
      logWithTime(`❌ [validateMultipleEnums] Error: ${error.message} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, error.message);
    }
  };
};

module.exports = { validateMultipleEnums };
