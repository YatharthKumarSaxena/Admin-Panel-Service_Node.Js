const { isAdminAccountActive  } = require("./is-account-active.middleware");
const { validateJwtPayloadMiddleware } = require("./validate-jwt-payload.middleware");
const { verifyJWTSignature } = require("./verify-jwt-signature.middleware");
const { isAdmin } = require("./verify-admin-role.middleware");
const { validateRedisPayloadMiddleware } = require("./validate-redis-payload.middleware");
const { verifyDeviceField } = require("./verify-device-field.middleware");

const commonMiddlewares = {
    isAdminAccountActive,
    validateJwtPayloadMiddleware,
    verifyJWTSignature,
    isAdmin,
    validateRedisPayloadMiddleware,
    verifyDeviceField
};

module.exports = {
    commonMiddlewares
};