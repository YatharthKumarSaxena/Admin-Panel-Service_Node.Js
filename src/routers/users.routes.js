const { USER_ROUTES } = require("@configs/uri.config");

const {  
    BLOCK_USER,
    UNBLOCK_USER,
    GET_TOTAL_REGISTERED_USERS,
    LIST_USERS,
    VIEW_USER_DETAILS
} = USER_ROUTES;

const { userMiddlewares } = require("@middlewares/users/index");
const { commonMiddlewares } = require("@middlewares/common/index");
const { mockAuthMiddleware } = require("@testing/mock-auth.testing.middleware");
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

// Get total registered users
userRoutes.get(`${GET_TOTAL_REGISTERED_USERS}`,
    [
        ...baseMiddlerwares
    ],
    userControllers.getTotalRegisteredUsers
);

// List users
userRoutes.get(`${LIST_USERS}`,
    [
        ...baseMiddlerwares
    ],
    userControllers.listUsers
);

userRoutes.get(`${VIEW_USER_DETAILS}`,
    [
        ...baseMiddlerwares,
        userMiddlewares.validateFetchUserDetailsRequestBody,
        userMiddlewares.validateFetchUserDetailsFields
    ],
    userControllers.viewUserDetails
);

module.exports = {
    userRoutes
};