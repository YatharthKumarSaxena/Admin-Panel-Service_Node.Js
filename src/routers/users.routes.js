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

const userRoutes = require("express").Router();

// Block user
userRoutes.patch(`${BLOCK_USER}`,
    [
        ...baseMiddlewares,
        userMiddlewares.validateBlockUserRequestBody,
        userMiddlewares.validateBlockUserFields
    ],
    userControllers.blockUser
);

// Unblock user
userRoutes.patch(`${UNBLOCK_USER}`,
    [
        ...baseMiddlewares,
        userMiddlewares.validateUnblockUserRequestBody,
        userMiddlewares.validateUnblockUserFields
    ],
    userControllers.unblockUser
);

// Get total registered users
userRoutes.get(`${GET_TOTAL_REGISTERED_USERS}`,
    [
        ...baseMiddlewares
    ],
    userControllers.getTotalRegisteredUsers
);

// List users
userRoutes.get(`${LIST_USERS}`,
    [
        ...baseMiddlewares
    ],
    userControllers.listUsers
);

userRoutes.get(`${VIEW_USER_DETAILS}`,
    [
        ...baseMiddlewares,
        userMiddlewares.validateFetchUserDetailsRequestBody,
        userMiddlewares.validateFetchUserDetailsFields
    ],
    userControllers.viewUserDetails
);

module.exports = {
    userRoutes
};