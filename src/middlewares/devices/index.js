const { validateRequestBodyMiddlewares } = require("./validate-request-body.middleware");
const { validationMiddlewares } = require("./field-validation.middleware");

const deviceMiddlewares = {
  ...validateRequestBodyMiddlewares,
  ...validationMiddlewares,
};

module.exports = { deviceMiddlewares };
