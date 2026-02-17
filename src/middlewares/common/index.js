const { isAdminAccountActive  } = require("./is-account-active.middleware");
const { validateJwtPayloadMiddleware } = require("./validate-jwt-payload.middleware");
const { verifyJWTSignature } = require("./verify-jwt-signature.middleware");
const { isAdmin } = require("./verify-admin-role.middleware");
const { validateRedisPayloadMiddleware } = require("./validate-redis-payload.middleware");
const { verifyDeviceField } = require("./verify-device-field.middleware");
const { RoleMiddlewares } = require("./verify-admin-type.middleware");
const { hierarchyGuard } = require("./role-hierarchy.middleware");
const { isDeviceBlocked } = require("./is-device-blocked.middleware");
const { requestIdMiddleware } = require("./check-request-id.middleware");
const { firstNameValidator } = require("./first-name.middleware");
const { loadAdminPermissions } = require("./load-admin-permissions.middleware");

const commonMiddlewares = {
    isAdminAccountActive,
    validateJwtPayloadMiddleware,
    verifyJWTSignature,
    isAdmin,
    validateRedisPayloadMiddleware,
    verifyDeviceField,
    ...RoleMiddlewares,
    hierarchyGuard,
    isDeviceBlocked,
    requestIdMiddleware,
    firstNameValidator,
    loadAdminPermissions
};

module.exports = {
    commonMiddlewares
};