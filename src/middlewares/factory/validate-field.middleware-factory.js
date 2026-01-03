const { logMiddlewareError } = require("@utils/error-handler.util");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * 🏭 Flexible Field Validation Factory
 * 
 * Supports multiple validation types - sab optional hain:
 * - Length validation (min/max from config)
 * - Regex validation (pattern matching)
 * - Enum validation (using enum helpers)
 * - Custom validation (any util function)
 * 
 * Utils functions khud response handle karti hain, factory sirf orchestrate karta hai
 * 
 * @param {Object} fieldConfig - Configuration for field validation
 * @param {string} fieldConfig.fieldName - Name of the field to validate
 * @param {boolean} fieldConfig.required - Is field required? (default: true)
 * @param {Function} fieldConfig.validator - Validation function from utils (value, res) => boolean
 *                                           Example: validateEmail, validatePhone, BlockReasonHelper.validate
 * @param {string} middlewareName - Name of middleware for logging
 * @returns {Function} Middleware function
 * 
 * @example
 * // Email validation
 * validateFieldMiddleware({
 *   fieldName: 'email',
 *   required: true,
 *   validator: validateEmail
 * }, 'validateUserEmail')
 * 
 * @example
 * // Enum validation
 * validateFieldMiddleware({
 *   fieldName: 'blockReason',
 *   required: true,
 *   validator: BlockReasonHelper.validate
 * }, 'validateBlockReason')
 * 
 * @example
 * // Custom validation
 * validateFieldMiddleware({
 *   fieldName: 'supervisorId',
 *   required: true,
 *   validator: (value, res) => value !== 'self'
 * }, 'validateSupervisorId')
 */
const validateFieldMiddleware = (fieldConfig, middlewareName) => {
    return (req, res, next) => {
        try {
            const { fieldName, required = true, validator } = fieldConfig;

            const value = req.body[fieldName];

            // 1. Check if field is required
            if (required) {
                if (value === undefined || value === null) {
                    logMiddlewareError(middlewareName, `Missing required field: ${fieldName}`, req);
                    return;
                }

                // Check for empty strings after trimming
                if (typeof value === 'string' && value.trim().length === 0) {
                    logMiddlewareError(middlewareName, `Empty field: ${fieldName}`, req);
                    return;
                }
            } else {
                // If optional and not provided, skip validation
                if (value === undefined || value === null) {
                    return next();
                }

                // If optional and empty string, skip validation
                if (typeof value === 'string' && value.trim().length === 0) {
                    return next();
                }
            }

            // 2. Run validator if provided (utils function handles response)
            if (validator && typeof validator === 'function') {
                const isValid = validator(value, res);
                
                // If validator returns false, it already sent response
                if (!isValid) {
                    logMiddlewareError(middlewareName, `Validation failed for ${fieldName}`, req);
                    return;
                }
            }

            // 3. Trim string values
            if (typeof value === 'string') {
                req.body[fieldName] = value.trim();
            }

            logWithTime(`✅ [${middlewareName}] Field ${fieldName} validated successfully`);
            next();
        } catch (error) {
            logMiddlewareError(middlewareName, `Validation error: ${error.message}`, req);
            return;
        }
    };
};

/**
 * Validates multiple fields at once
 * 
 * @param {Array<Object>} fieldsConfig - Array of field configurations
 * @param {string} middlewareName - Name of middleware for logging
 * @returns {Array<Function>} Array of middleware functions
 * 
 * @example
 * validateFieldsMiddleware([
 *   { fieldName: 'email', required: true, validator: validateEmail },
 *   { fieldName: 'phone', required: false, validator: validatePhone },
 *   { fieldName: 'deviceType', required: true, validator: DeviceTypeHelper.validate }
 * ], 'validateUserRegistration')
 */
const validateFieldsMiddleware = (fieldsConfig, middlewareName) => {
    return fieldsConfig.map(fieldConfig =>
        validateFieldMiddleware(fieldConfig, middlewareName)
    );
};

module.exports = {
    validateFieldMiddleware,
    validateFieldsMiddleware
};
