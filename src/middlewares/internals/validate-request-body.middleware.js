const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const {
    blockDeviceRequiredFields,
    unblockDeviceRequiredFields,
    provideUserAccountDetailsRequiredFields,
    getUserActiveDevicesRequiredFields,
    checkAuthLogsRequiredFields
} = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {

    // User Details Operations
    validateProvideUserAccountDetailsRequestBody: validateRequestBodyMiddleware(
        provideUserAccountDetailsRequiredFields,
        "validateProvideUserAccountDetailsRequestBody"
    ),

    validateGetUserActiveDevicesRequestBody: validateRequestBodyMiddleware(
        getUserActiveDevicesRequiredFields,
        "validateGetUserActiveDevicesRequestBody"
    ),

    // Auth Logs Operations
    validateCheckAuthLogsRequestBody: validateRequestBodyMiddleware(
        checkAuthLogsRequiredFields,
        "validateCheckAuthLogsRequestBody"
    )
};

module.exports = {
    validateRequestBodyMiddlewares
}

