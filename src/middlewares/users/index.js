const { validateRequestBodyMiddlewares } = require("./validate-request-body.middleware");
const { validationMiddlewares } = require("./field-validation.middleware");

const userMiddlewares = {
  ...validateRequestBodyMiddlewares,
  ...validationMiddlewares,
};

module.exports = { userMiddlewares };
