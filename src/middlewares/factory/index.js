const { createRoleMiddleware } = require("./role-based-access.middleware-factory");
const { checkBodyPresence, checkParamsPresence, checkQueryPresence } = require("./validate-request-body.middleware-factory");
const { validateXLSXMiddleware } = require("./validate-xlsx.middleware-factory");
const { fetchEntityFactory } = require("./fetch-entity.middleware-factory");
const { validateBody, validateParams, validateQuery } = require("./field-validation.middleware-factory");
const { createAuthValidator } = require("./auth-mode-middleware.factory");
const { sanitizeAuthPayload } = require("./sanitize-auth-payload.middleware.factory");
const { createRbacPermissionMiddleware } = require("./rbac-permission.middleware-factory");
const { checkFeatureEnabled, checkBooleanFeature, checkEnumFeature } = require("./feature-enabled.middleware-factory");

const factoryMiddlewares = {
    createRoleMiddleware,
    validateXLSXMiddleware,
    fetchEntityFactory,
    validateBody,
    validateParams,
    validateQuery,
    checkBodyPresence,
    checkParamsPresence,
    checkQueryPresence,
    createAuthValidator,
    sanitizeAuthPayload,
    createRbacPermissionMiddleware,
    checkFeatureEnabled,
    checkBooleanFeature,
    checkEnumFeature
};

module.exports = { factoryMiddlewares };