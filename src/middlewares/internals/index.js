const fieldValidation = require("./field-validation.middleware");
const requestBodyValidation = require("./validate-request-body.middleware");

module.exports = {
  ...fieldValidation,
  ...requestBodyValidation
};
