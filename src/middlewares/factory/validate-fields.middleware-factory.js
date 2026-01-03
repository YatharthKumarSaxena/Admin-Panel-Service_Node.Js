const { validationRules } = require("@configs/validation.config");
const { validateLength, isValidRegex } = require("@utils/validators-factory.util");
const { getLogIdentifiers, throwBadRequestError } = require("@utils/error-handler.util");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * 🏭 Smart Combined Validation Middleware Factory
 * 
 * ✅ Validates multiple fields based on validation config
 * ✅ Collects ALL errors before responding (doesn't stop at first error)
 * ✅ Auto-detects validation type: length, regex, enum
 * ✅ Returns comprehensive error array with all issues
 * 
 * @param {Array<string>} fieldKeys - Array of field names to validate (from validationRules)
 * @param {string} middlewareName - Name for logging (optional)
 * @returns {Function} Express middleware
 * 
 * @example
 * // Simple validation
 * router.post('/create-admin',
 *   validateFields(['email', 'adminType']),
 *   createAdminController
 * );
 * 
 * @example
 * // Multiple fields with different validation types
 * router.post('/block-user',
 *   validateFields(['email', 'blockReason', 'notes', 'performedBy']),
 *   blockUserController
 * );
 * 
 * @example Response if multiple errors
 * {
 *   "success": false,
 *   "message": [
 *     "email format is invalid",
 *     "reason must be between 10 and 500 characters",
 *     "adminType must be one of: SUPER_ADMIN, MID_ADMIN, LOW_ADMIN"
 *   ]
 * }
 */
const validateFields = (fieldKeys, middlewareName = "validateFields") => {
  return (req, res, next) => {
    try {
      const { requestId, ipAddress } = getLogIdentifiers(req);
      logWithTime(`🔍 [${middlewareName}] Starting validation for: ${fieldKeys.join(', ')} | RequestID: ${requestId}`);

      const errors = [];
      const body = req.body;

      // Validate each field
      fieldKeys.forEach(fieldKey => {
        const rule = validationRules[fieldKey];
        
        // Check if rule exists
        if (!rule) {
          logWithTime(`⚠️ [${middlewareName}] No validation rule configured for field: ${fieldKey}`);
          errors.push(`Validation configuration missing for field: ${fieldKey}`);
          return;
        }

        const value = body[fieldKey];
        const isRequired = rule.required !== false; // Default to true if not specified

        // ✅ Step 1: Check if required field is missing
        if (isRequired && (value === null || value === undefined || (typeof value === 'string' && value.trim() === ''))) {
          errors.push(`${fieldKey} is required`);
          return; // Skip further validation for this field
        }

        // Skip validation if field is optional and not provided
        if (!isRequired && (value === null || value === undefined || value === '')) {
          logWithTime(`ℹ️ [${middlewareName}] Optional field ${fieldKey} not provided, skipping validation`);
          return;
        }

        // Trim string values
        if (typeof value === 'string') {
          body[fieldKey] = value.trim();
        }

        // ✅ Step 2: Length validation (if configured)
        if (rule.length) {
          const { min = 0, max = Infinity } = rule.length;
          
          if (typeof body[fieldKey] !== 'string') {
            errors.push(`${fieldKey} must be a string`);
            return;
          }

          if (!validateLength(body[fieldKey], min, max)) {
            // Smart error message generation
            if (min === max) {
              errors.push(`${fieldKey} must be exactly ${min} characters`);
            } else if (min > 0 && max < Infinity) {
              errors.push(`${fieldKey} must be between ${min} and ${max} characters`);
            } else if (min > 0) {
              errors.push(`${fieldKey} must be at least ${min} characters`);
            } else {
              errors.push(`${fieldKey} must not exceed ${max} characters`);
            }
            // Don't return - continue to check other validations
          }
        }

        // ✅ Step 3: Regex validation (if configured)
        if (rule.regex) {
          if (typeof body[fieldKey] !== 'string') {
            errors.push(`${fieldKey} must be a string`);
            return;
          }

          if (!isValidRegex(body[fieldKey], rule.regex)) {
            const errorMessage = rule.message || `${fieldKey} format is invalid`;
            errors.push(errorMessage);
            // Don't return - continue to check other validations
          }
        }

        // ✅ Step 4: Enum validation (if configured)
        if (rule.enum) {
          const enumHelper = rule.enum;
          
          // Use enum helper's validate method
          const isValid = enumHelper.validate(body[fieldKey]);
          
          if (!isValid) {
            const validValues = enumHelper.getValidValues();
            errors.push(`${fieldKey} must be one of: ${validValues.join(', ')}`);
            // Don't return - continue to check other validations
          }
        }
      });

      // ❌ If any errors found, return ALL errors at once
      if (errors.length > 0) {
        logWithTime(`❌ [${middlewareName}] Validation failed | Total errors: ${errors.length}`);
        logWithTime(`   Errors: ${errors.join(' | ')}`);
        
        // Return array of errors or single error based on count
        return throwBadRequestError(res, errors.length === 1 ? errors[0] : errors);
      }

      // ✅ All validations passed
      logWithTime(`✅ [${middlewareName}] All field validations passed | Fields: ${fieldKeys.join(', ')}`);
      next();
    } catch (error) {
      logWithTime(`💥 [${middlewareName}] Unexpected error during validation: ${error.message}`);
      return throwBadRequestError(res, `Validation error: ${error.message}`);
    }
  };
};

module.exports = { validateFields };
