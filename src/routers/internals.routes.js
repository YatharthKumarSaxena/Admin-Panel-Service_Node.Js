const express = require("express");
const internalRoutes = express.Router();

// Controllers
const { internalControllers } = require("@controllers/internals/index");
const { baseMiddlewares } = require("./middleware.gateway");
// Middlewares
const { internalMiddlewares } = require("@middlewares/internals/index");
// Routes Config
const { INTERNAL_ROUTES } = require("@configs/uri.config");

const {
  GET_USER_ACTIVE_SESSIONS,
  GET_USER_AUTH_LOGS,
  FETCH_USER_DETAILS
} = INTERNAL_ROUTES;

// Get user's active sessions
internalRoutes.get(`${GET_USER_ACTIVE_SESSIONS}`,
    [
        ...baseMiddlewares,
        internalMiddlewares.validateGetUserActiveDevicesRequestBody,
        internalMiddlewares.validateGetUserActiveDevicesFields
    ],
    internalControllers.getUserActiveDevices
);

// Get user auth logs
internalRoutes.get(`${GET_USER_AUTH_LOGS}`,
    [
        ...baseMiddlewares,
        internalMiddlewares.validateCheckAuthLogsRequestBody,
        internalMiddlewares.validateCheckAuthLogsFields
    ],
    internalControllers.checkAuthLogs
);

// Fetch user details
internalRoutes.get(`${FETCH_USER_DETAILS}`,
    [
        ...baseMiddlewares,
        internalMiddlewares.validateProvideUserAccountDetailsRequestBody,
        internalMiddlewares.validateProvideUserAccountDetailsFields
    ],
    internalControllers.provideUserAccountDetails
);

module.exports = {
  internalRoutes
}
