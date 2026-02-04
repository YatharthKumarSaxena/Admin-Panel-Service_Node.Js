const { checkQueryPresence } = require("../factory/validate-request-body.middleware-factory");
const {
    provideUserAccountDetailsRequiredFields,
    getUserActiveDevicesRequiredFields,
    checkAuthLogsRequiredFields
} = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {

    // User Details Operations
    validateProvideUserAccountDetailsRequestBody: checkQueryPresence(
        "validateProvideUserAccountDetailsRequestBody",
        provideUserAccountDetailsRequiredFields
    ),

    validateGetUserActiveDevicesRequestBody: checkQueryPresence(
        "validateGetUserActiveDevicesRequestBody",
        getUserActiveDevicesRequiredFields
    ),

    // Auth Logs Operations
    validateCheckAuthLogsRequestBody: checkQueryPresence(
        "validateCheckAuthLogsRequestBody",
        checkAuthLogsRequiredFields
    )
};

module.exports = {
    validateRequestBodyMiddlewares
}

