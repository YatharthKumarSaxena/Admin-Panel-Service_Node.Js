const { createRoleMiddleware } = require("./role-based-access.middleware-factory");
const { validateRequestBodyMiddleware } = require("./validate-request-body.middleware-factory");
const { validateXLSXMiddleware } = require("./validate-xlsx.middleware-factory");

const factoryMiddlewares = {
    createRoleMiddleware,
    validateRequestBodyMiddleware,
    validateXLSXMiddleware
};

module.exports = { factoryMiddlewares };