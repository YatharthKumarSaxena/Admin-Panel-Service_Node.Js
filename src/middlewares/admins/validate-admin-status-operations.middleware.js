const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const { 
  activateAdminRequiredFields,
  deactivateAdminRequiredFields,
  blockAdminRequiredFields,
  unblockAdminRequiredFields
} = require("@configs/required-fields.config.js");
const { throwBadRequestError } = require("@utils/error-handler.util");

/**
 * ✅ Validate Activate Admin Request Body
 */
const validateActivateAdminRequestBody = [
  validateRequestBodyMiddleware(activateAdminRequiredFields, "validateActivateAdminRequestBody"),
  (req, res, next) => {
    const { reason, notes } = req.body;

    // Validate reason (compulsory)
    if (typeof reason !== 'string') {
      return throwBadRequestError(res, "Invalid reason format", "Reason must be a string");
    }
    if (reason.trim().length === 0) {
      return throwBadRequestError(res, "Reason cannot be empty", "Please provide a valid reason");
    }
    if (reason.length < 10) {
      return throwBadRequestError(res, "Reason too short", "Reason must be at least 10 characters");
    }
    if (reason.length > 500) {
      return throwBadRequestError(res, "Reason too long", "Reason must be less than 500 characters");
    }

    // Optional notes validation
    if (notes !== undefined) {
      if (typeof notes !== 'string') {
        return throwBadRequestError(res, "Invalid notes format", "Notes must be a string");
      }
      if (notes.trim().length === 0) {
        return throwBadRequestError(res, "Notes cannot be empty", "Provide valid notes or remove the field");
      }
      if (notes.length > 500) {
        return throwBadRequestError(res, "Notes too long", "Notes must be less than 500 characters");
      }
    }

    next();
  }
];

/**
 * ❌ Validate Deactivate Admin Request Body
 */
const validateDeactivateAdminRequestBody = [
  validateRequestBodyMiddleware(deactivateAdminRequiredFields, "validateDeactivateAdminRequestBody"),
  (req, res, next) => {
    const { reason, notes } = req.body;

    // Validate reason (compulsory)
    if (typeof reason !== 'string') {
      return throwBadRequestError(res, "Invalid reason format", "Reason must be a string");
    }
    if (reason.trim().length === 0) {
      return throwBadRequestError(res, "Reason cannot be empty", "Please provide a valid reason");
    }
    if (reason.length < 10) {
      return throwBadRequestError(res, "Reason too short", "Reason must be at least 10 characters");
    }
    if (reason.length > 500) {
      return throwBadRequestError(res, "Reason too long", "Reason must be less than 500 characters");
    }

    // Optional notes validation
    if (notes !== undefined) {
      if (typeof notes !== 'string') {
        return throwBadRequestError(res, "Invalid notes format", "Notes must be a string");
      }
      if (notes.trim().length === 0) {
        return throwBadRequestError(res, "Notes cannot be empty", "Provide valid notes or remove the field");
      }
      if (notes.length > 500) {
        return throwBadRequestError(res, "Notes too long", "Notes must be less than 500 characters");
      }
    }

    next();
  }
];

/**
 * 🚫 Validate Block Admin Request Body
 */
const validateBlockAdminRequestBody = [
  validateRequestBodyMiddleware(blockAdminRequiredFields, "validateBlockAdminRequestBody"),
  (req, res, next) => {
    const { reason, notes, blockDuration } = req.body;

    // Validate reason (compulsory)
    if (typeof reason !== 'string') {
      return throwBadRequestError(res, "Invalid reason format", "Reason must be a string");
    }
    if (reason.trim().length === 0) {
      return throwBadRequestError(res, "Reason cannot be empty", "Please provide a valid reason");
    }
    if (reason.length < 10) {
      return throwBadRequestError(res, "Reason too short", "Reason must be at least 10 characters");
    }
    if (reason.length > 500) {
      return throwBadRequestError(res, "Reason too long", "Reason must be less than 500 characters");
    }

    // Optional blockDuration validation
    if (blockDuration !== undefined) {
      if (typeof blockDuration !== 'number') {
        return throwBadRequestError(res, "Invalid blockDuration format", "blockDuration must be a number (days)");
      }
      if (blockDuration <= 0) {
        return throwBadRequestError(res, "Invalid blockDuration value", "blockDuration must be greater than 0");
      }
      if (blockDuration > 365) {
        return throwBadRequestError(res, "blockDuration too long", "blockDuration cannot exceed 365 days");
      }
    }

    // Optional notes validation
    if (notes !== undefined) {
      if (typeof notes !== 'string') {
        return throwBadRequestError(res, "Invalid notes format", "Notes must be a string");
      }
      if (notes.trim().length === 0) {
        return throwBadRequestError(res, "Notes cannot be empty", "Provide valid notes or remove the field");
      }
      if (notes.length > 500) {
        return throwBadRequestError(res, "Notes too long", "Notes must be less than 500 characters");
      }
    }

    next();
  }
];

/**
 * 🔓 Validate Unblock Admin Request Body
 */
const validateUnblockAdminRequestBody = [
  validateRequestBodyMiddleware(unblockAdminRequiredFields, "validateUnblockAdminRequestBody"),
  (req, res, next) => {
    const { reason, notes } = req.body;

    // Validate reason (compulsory)
    if (typeof reason !== 'string') {
      return throwBadRequestError(res, "Invalid reason format", "Reason must be a string");
    }
    if (reason.trim().length === 0) {
      return throwBadRequestError(res, "Reason cannot be empty", "Please provide a valid reason");
    }
    if (reason.length < 10) {
      return throwBadRequestError(res, "Reason too short", "Reason must be at least 10 characters");
    }
    if (reason.length > 500) {
      return throwBadRequestError(res, "Reason too long", "Reason must be less than 500 characters");
    }

    // Optional notes validation
    if (notes !== undefined) {
      if (typeof notes !== 'string') {
        return throwBadRequestError(res, "Invalid notes format", "Notes must be a string");
      }
      if (notes.trim().length === 0) {
        return throwBadRequestError(res, "Notes cannot be empty", "Provide valid notes or remove the field");
      }
      if (notes.length > 500) {
        return throwBadRequestError(res, "Notes too long", "Notes must be less than 500 characters");
      }
    }

    next();
  }
];

module.exports = {
  validateActivateAdminRequestBody,
  validateDeactivateAdminRequestBody,
  validateBlockAdminRequestBody,
  validateUnblockAdminRequestBody
};
