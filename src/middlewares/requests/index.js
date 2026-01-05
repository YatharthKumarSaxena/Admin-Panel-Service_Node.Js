const { validationMiddlewares } = require("./field-validation.middleware");
const { validateRequestBodyMiddlewares } = require("./validate-request-body.middleware");

const requestMiddlewares = {
    ...validationMiddlewares,
    ...validateRequestBodyMiddlewares
};

module.exports = {
    requestMiddlewares
}