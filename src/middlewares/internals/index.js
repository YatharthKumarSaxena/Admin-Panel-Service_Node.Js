const { validationMiddlewares } = require("./field-validation.middleware");
const { validateRequestBodyMiddlewares } = require("./validate-request-body.middleware");

const internalMiddlewares = {
  ...validationMiddlewares,
  ...validateRequestBodyMiddlewares
};

module.exports = {
    internalMiddlewares
}
