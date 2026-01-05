const { USER_ROUTES } = require("@configs/uri.config");

const {  
    BLOCK_USER,
    UNBLOCK_USER,
    GET_USER_ACTIVE_SESSIONS,
    GET_TOTAL_REGISTERED_USERS,
    GET_USER_AUTH_LOGS,
    FETCH_USER_DETAILS,
    LIST_USERS
} = USER_ROUTES;

const { userMiddlewares } = require("@middlewares/users/index");
const { commonMiddlewares } = require("@middlewares/common/index");
const { mockAuthMiddleware } = require("@middlewares/factory/mock-auth.middleware-factory");
const { userControllers } = require("@controllers/users/index");

const userRoutes = require("express").Router();

const baseMiddlerwares = [
    commonMiddlewares.verifyDeviceField,
    mockAuthMiddleware,
//  commonMiddlewares.validateRedisPayloadMiddleware,
//  commonMiddlewares.validateJwtPayloadMiddleware,
//  commonMiddlewares.verifyJWTSignature,
    commonMiddlewares.isAdmin,
    commonMiddlewares.isAdminAccountActive
];

// Block user
userRoutes.patch(`${BLOCK_USER}`,
    [
        ...baseMiddlerwares,
        userMiddlewares.validateBlockUserRequestBody,
        userMiddlewares.validateBlockUserFields
    ],
    userControllers.blockUser
);

// Unblock user
userRoutes.patch(`${UNBLOCK_USER}`,
    [
        ...baseMiddlerwares,
        userMiddlewares.validateUnblockUserRequestBody,
        userMiddlewares.validateUnblockUserFields
    ],
    userControllers.unblockUser
);

// Get user's active sessions
userRoutes.get(`${GET_USER_ACTIVE_SESSIONS}`,
    [
        ...baseMiddlerwares,
        userMiddlewares.validateGetUserActiveDevicesRequestBody,
        userMiddlewares.validateGetUserActiveDevicesFields
    ],
    userControllers.getUserActiveDevices
);

// Get total registered users
userRoutes.get(`${GET_TOTAL_REGISTERED_USERS}`,
    [
        ...baseMiddlerwares
    ],
    userControllers.getTotalRegisteredUsers
);

// Get user auth logs
userRoutes.get(`${GET_USER_AUTH_LOGS}`,
    [
        ...baseMiddlerwares,
        userMiddlewares.validateCheckAuthLogsRequestBody,
        userMiddlewares.validateCheckAuthLogsFields
    ],
    userControllers.getUserAuthLogs
);

// Fetch user details
userRoutes.get(`${FETCH_USER_DETAILS}`,
    [
        ...baseMiddlerwares,
        userMiddlewares.validateProvideUserAccountDetailsRequestBody,
        userMiddlewares.validateProvideUserAccountDetailsFields
    ],
    userControllers.fetchUserDetails
);

// List users
userRoutes.get(`${LIST_USERS}`,
    [
        ...baseMiddlerwares
    ],
    userControllers.listUsers
);

module.exports = {
    userRoutes
};