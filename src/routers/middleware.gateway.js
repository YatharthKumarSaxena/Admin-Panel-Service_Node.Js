const { commonMiddlewares } = require("@middlewares/common/index");

const {
    verifyDeviceField,
    isDeviceBlocked,
    validateRedisPayloadMiddleware,
    validateJwtPayloadMiddleware,
    verifyJWTSignature,
    isAdmin,
    isAdminAccountActive,
} = commonMiddlewares;

const { mockAuthMiddleware } = require("testing/mock-auth.testing.middleware");

const baseMiddlewares = [
    verifyDeviceField,
    isDeviceBlocked,
    mockAuthMiddleware,
    // validateRedisPayloadMiddleware,
    // validateJwtPayloadMiddleware,
    // verifyJWTSignature,
    isAdmin,
    isAdminAccountActive
];

module.exports = {
    baseMiddlewares
};