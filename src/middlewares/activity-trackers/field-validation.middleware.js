const { validateQuery } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

const validationMiddlewares = {
  validateViewAdminActivityTrackerFields: validateQuery("viewAdminActivityTracker", validationSets.viewAdminActivityTracker)
}

module.exports = {
    validationMiddlewares
}