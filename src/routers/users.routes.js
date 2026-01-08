const { USER_ROUTES } = require("@configs/uri.config");

const {  
    BLOCK_USER,
    UNBLOCK_USER,
    GET_TOTAL_REGISTERED_USERS,
    LIST_USERS,
    VIEW_USER_DETAILS
} = USER_ROUTES;

const { userMiddlewares } = require("@middlewares/users/index");
const { baseMiddlewares } = require("./middleware.gateway");
const { userControllers } = require("@controllers/users/index");

// Rate Limiters
const {
    blockUserLimiter,
    unblockUserLimiter,
    getTotalRegisteredUsersLimiter,
    listUsersLimiter,
    viewUserDetailsLimiter
} = require("@/rate-limiters/index");

const userRoutes = require("express").Router();

// Block user
userRoutes.patch(`${BLOCK_USER}`,
    [
        blockUserLimiter,
        ...baseMiddlewares,
        userMiddlewares.validateBlockUserRequestBody,
        userMiddlewares.validateBlockUserFields
    ],
    userControllers.blockUser
);

// Unblock user
userRoutes.patch(`${UNBLOCK_USER}`,
    [
        unblockUserLimiter,
        ...baseMiddlewares,
        userMiddlewares.validateUnblockUserRequestBody,
        userMiddlewares.validateUnblockUserFields
    ],
    userControllers.unblockUser
);

// Get total registered users
userRoutes.get(`${GET_TOTAL_REGISTERED_USERS}`,
    [
        getTotalRegisteredUsersLimiter,
        ...baseMiddlewares
    ],
    userControllers.getTotalRegisteredUsers
);

// List users
userRoutes.get(`${LIST_USERS}`,
    [
        listUsersLimiter,
        ...baseMiddlewares
    ],
    userControllers.listUsers
);

userRoutes.get(`${VIEW_USER_DETAILS}`,
    [
        viewUserDetailsLimiter,
        ...baseMiddlewares,
        userMiddlewares.validateFetchUserDetailsRequestBody,
        userMiddlewares.validateFetchUserDetailsFields
    ],
    userControllers.viewUserDetails
);

module.exports = {
    userRoutes
};