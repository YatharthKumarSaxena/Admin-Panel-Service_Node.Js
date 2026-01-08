const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const {
    blockDeviceRequiredFields,
    unblockDeviceRequiredFields,
    fetchDeviceDetailsRequiredFields
} = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
    // Device Operations
    validateBlockDeviceRequestBody: validateRequestBodyMiddleware(
        blockDeviceRequiredFields,
        "validateBlockDeviceRequestBody"
    ),

    validateUnblockDeviceRequestBody: validateRequestBodyMiddleware(
        unblockDeviceRequiredFields,
        "validateUnblockDeviceRequestBody"
    ),

    validateFetchDeviceDetailsRequestBody: validateRequestBodyMiddleware(
        fetchDeviceDetailsRequiredFields,
        "validateFetchDeviceDetailsRequestBody"
    )
};

module.exports = {
    validateRequestBodyMiddlewares
};

