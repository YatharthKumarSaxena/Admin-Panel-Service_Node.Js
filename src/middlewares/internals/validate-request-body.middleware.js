const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const {
    blockDeviceRequiredFields,
    unblockDeviceRequiredFields
} = require("@configs/required-fields.config.js");

module.exports = {
    // Device Status Operations
    validateBlockDeviceRequestBody: validateRequestBodyMiddleware(
        blockDeviceRequiredFields,
        "validateBlockDeviceRequestBody"
    ),

    validateUnblockDeviceRequestBody: validateRequestBodyMiddleware(
        unblockDeviceRequiredFields,
        "validateUnblockDeviceRequestBody"
    )
};

