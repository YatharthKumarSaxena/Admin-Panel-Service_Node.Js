const { checkBodyPresence } = require("../factory/validate-request-body.middleware-factory");
const { 
    createActivationRequestRequiredFields, 
    createDeactivationRequestRequiredFields, 
    approveActivationRequestRequiredFields, 
    approveDeactivationRequestRequiredFields, 
    rejectActivationRequestRequiredFields, 
    rejectDeactivationRequestRequiredFields 
} = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
  validateCreateActivationRequestBody: checkBodyPresence(
    "validateCreateActivationRequestBody",
    createActivationRequestRequiredFields
  ),
  validateCreateDeactivationRequestBody: checkBodyPresence(
    "validateCreateDeactivationRequestBody",
    createDeactivationRequestRequiredFields
  ),
  validateApproveActivationRequestBody: checkBodyPresence(
    "validateApproveActivationRequestBody",
    approveActivationRequestRequiredFields
  ),
  validateApproveDeactivationRequestBody: checkBodyPresence(
    "validateApproveDeactivationRequestBody",
    approveDeactivationRequestRequiredFields
  ),
  validateRejectActivationRequestBody: checkBodyPresence(
    "validateRejectActivationRequestBody",
    rejectActivationRequestRequiredFields
  ),
  validateRejectDeactivationRequestBody: checkBodyPresence(
    "validateRejectDeactivationRequestBody",
    rejectDeactivationRequestRequiredFields
  )
}

module.exports = {
  validateRequestBodyMiddlewares
}