const { fieldValidationMiddleware } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

const validationMiddlewares = {
  validateViewAdminActivityTrackerFields: fieldValidationMiddleware("viewAdminActivityTracker", validationSets.viewAdminActivityTracker),
  validateListActivityTrackerFields: fieldValidationMiddleware("listActivityTracker", validationSets.listActivityTracker)
}

module.exports = {
    validationMiddlewares
}