const { validateBody } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

const validationMiddlewares = {
  validateApproveActivationRequestFields: validateBody("approveActivationRequest", validationSets.approveActivationRequest),
  validateRejectActivationRequestFields: validateBody("rejectActivationRequest", validationSets.rejectActivationRequest),
  validateApproveDeactivationRequestFields: validateBody("approveDeactivationRequest", validationSets.approveDeactivationRequest),
  validateRejectDeactivationRequestFields: validateBody("rejectDeactivationRequest", validationSets.rejectDeactivationRequest),
  validateCreateActivationRequestFields: validateBody("createActivationRequest", validationSets.createActivationRequest),
  validateCreateDeactivationRequestFields: validateBody("createDeactivationRequest", validationSets.createDeactivationRequest)
}

module.exports = {
  validationMiddlewares
}