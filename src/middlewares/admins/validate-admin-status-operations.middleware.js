const { validateFields } = require("../factory/validate-fields.middleware-factory");

/**
 * ✅ Admin Status Operations Validation
 * 
 * Uses centralized validation config for consistent validation
 * All field rules defined in validation.config.js
 * 
 * Benefits:
 * - ✅ Collects ALL errors before responding
 * - ✅ Auto-validates length, regex, enum based on config
 * - ✅ DRY - No repeated validation logic
 * - ✅ Maintainable - Change config, all routes update
 */

/**
 * ✅ Validate Activate Admin Request Body
 * Fields: reason (required, 10-500 chars), notes (optional, max 500 chars)
 */
const validateActivateAdminRequestBody = validateFields(
  ['reason', 'notes'], 
  "validateActivateAdminRequestBody"
);

/**
 * ❌ Validate Deactivate Admin Request Body
 * Fields: reason (required, 10-500 chars), deactivateReason (enum), notes (optional)
 */
const validateDeactivateAdminRequestBody = validateFields(
  ['reason', 'deactivateReason', 'notes'],
  "validateDeactivateAdminRequestBody"
);

/**
 * 🚫 Validate Block Admin Request Body
 * Fields: reason (required, 10-500 chars), blockReason (enum), notes (optional)
 */
const validateBlockAdminRequestBody = validateFields(
  ['reason', 'blockReason', 'notes'],
  "validateBlockAdminRequestBody"
);

/**
 * ✅ Validate Unblock Admin Request Body
 * Fields: reason (required, 10-500 chars), unblockReason (enum), notes (optional)
 */
const validateUnblockAdminRequestBody = validateFields(
  ['reason', 'unblockReason', 'notes'],
  "validateUnblockAdminRequestBody"
);

module.exports = {
  validateActivateAdminRequestBody,
  validateDeactivateAdminRequestBody,
  validateBlockAdminRequestBody,
  validateUnblockAdminRequestBody
};
