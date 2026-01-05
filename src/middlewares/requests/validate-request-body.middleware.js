const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const { 
    createActivationRequestRequiredFields, 
    createDeactivationRequestRequiredFields, 
    approveActivationRequestRequiredFields, 
    approveDeactivationRequestRequiredFields, 
    rejectActivationRequestRequiredFields, 
    rejectDeactivationRequestRequiredFields 
} = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
  validateCreateActivationRequestBody: validateRequestBodyMiddleware(
    createActivationRequestRequiredFields,
    "validateCreateActivationRequestBody"
  ),
  validateCreateDeactivationRequestBody: validateRequestBodyMiddleware(
    createDeactivationRequestRequiredFields,
    "validateCreateDeactivationRequestBody"
  ),
  validateApproveActivationRequestBody: validateRequestBodyMiddleware(
    approveActivationRequestRequiredFields,
    "validateApproveActivationRequestBody"
  ),
  validateApproveDeactivationRequestBody: validateRequestBodyMiddleware(
    approveDeactivationRequestRequiredFields,
    "validateApproveDeactivationRequestBody"
  ),
  validateRejectActivationRequestBody: validateRequestBodyMiddleware(
    rejectActivationRequestRequiredFields,
    "validateRejectActivationRequestBody"
  ),
  validateRejectDeactivationRequestBody: validateRequestBodyMiddleware(
    rejectDeactivationRequestRequiredFields,
    "validateRejectDeactivationRequestBody"
  )
}

module.exports = {
  validateRequestBodyMiddlewares
}