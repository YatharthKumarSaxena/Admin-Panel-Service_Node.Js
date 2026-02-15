// HELPER: Get Required Fields Array

/**
 * Extracts required field names from a definition object
 * @param {Object} definition - Field definition object (e.g., FieldDefinitions.SIGN_UP)
 * @returns {Array<string>} - Array of required field names
 * 
 * Example:
 * getRequiredFields(FieldDefinitions.CHANGE_PASSWORD) 
 * => ['password', 'newPassword', 'confirmPassword']
 */

const getRequiredFields = (definition) => {
  return Object.values(definition)
    .filter(fieldMeta => fieldMeta.required)
    .map(fieldMeta => fieldMeta.field);
};

// HELPER: Get Validation Set

/**
 * Extracts validation rules mapped to field names
 * @param {Object} definition - Field definition object
 * @returns {Object} - Validation set { fieldName: validationRule }
 * 
 * Example:
 * getValidationSet(FieldDefinitions.VERIFY_PHONE)
 * => { phone: validationRules.phone }
 */

const getValidationSet = (definition) => {
  return Object.values(definition).reduce((acc, fieldMeta) => {
    if (fieldMeta.validation) {
      acc[fieldMeta.field] = fieldMeta.validation;
    }
    return acc;
  }, {});
};

module.exports = {
  getRequiredFields,
  getValidationSet
};