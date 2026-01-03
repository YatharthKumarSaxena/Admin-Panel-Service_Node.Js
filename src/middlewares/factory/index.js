const { createRoleMiddleware } = require("./role-based-access.middleware-factory");
const { validateRequestBodyMiddleware } = require("./validate-request-body.middleware-factory");
const { validateXLSXMiddleware } = require("./validate-xlsx.middleware-factory");
const { fetchEntityFactory } = require("./fetch-entity.middleware-factory");
const { validateFieldLength } = require("./validate-field-length.middleware-factory");
const { validateFieldRegex } = require("./validate-field-regex.middleware-factory");
const { validateFieldEnum } = require("./validate-field-enum.middleware-factory");
const { validateMultipleEnums } = require("./validate-multiple-enums.middleware-factory");
const { validateFields } = require("./validate-fields.middleware-factory");

const factoryMiddlewares = {
    createRoleMiddleware,
    validateRequestBodyMiddleware,
    validateXLSXMiddleware,
    fetchEntityFactory,
    validateFieldLength,
    validateFieldRegex,
    validateFieldEnum,
    validateMultipleEnums,
    validateFields  // ✅ New combined validation factory
};

module.exports = { factoryMiddlewares };