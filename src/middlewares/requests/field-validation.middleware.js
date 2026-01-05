const { fieldValidationMiddleware } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

const validationMiddlewares = {
  validateApproveActivationRequestFields: fieldValidationMiddleware("approveActivationRequest", validationSets.approveActivationRequest),
  validateRejectActivationRequestFields: fieldValidationMiddleware("rejectActivationRequest", validationSets.rejectActivationRequest),
  validateApproveDeactivationRequestFields: fieldValidationMiddleware("approveDeactivationRequest", validationSets.approveDeactivationRequest),
  validateRejectDeactivationRequestFields: fieldValidationMiddleware("rejectDeactivationRequest", validationSets.rejectDeactivationRequest),
  validateCreateActivationRequestFields: fieldValidationMiddleware("createActivationRequest", validationSets.createActivationRequest),
  validateCreateDeactivationRequestFields: fieldValidationMiddleware("createDeactivationRequest", validationSets.createDeactivationRequest)
}

module.exports = {
  validationMiddlewares
}