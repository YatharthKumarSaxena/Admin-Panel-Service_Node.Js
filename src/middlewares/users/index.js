const { validateRequestBodyMiddlewares } = require("./validate-request-body.middleware");
const { validationMiddlewares } = require("./field-validation.middleware");
const { ensureUserExists, ensureUserNew } = require("./fetch-user.middleware");

const userMiddlewares = {
  ...validateRequestBodyMiddlewares,
  ...validationMiddlewares,
  ensureUserExists,
  ensureUserNew
};

module.exports = { userMiddlewares };
