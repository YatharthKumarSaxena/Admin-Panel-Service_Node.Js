const { checkBodyPresence, checkQueryPresence } = require("../factory/validate-request-body.middleware-factory");
const {
    blockDeviceRequiredFields,
    unblockDeviceRequiredFields,
    fetchDeviceDetailsRequiredFields
} = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
    // Device Operations
    validateBlockDeviceRequestBody: checkBodyPresence(
        blockDeviceRequiredFields,
        "validateBlockDeviceRequestBody"
    ),

    validateUnblockDeviceRequestBody: checkBodyPresence(
        unblockDeviceRequiredFields,
        "validateUnblockDeviceRequestBody"
    ),

    validateFetchDeviceDetailsRequestBody: checkQueryPresence(
        fetchDeviceDetailsRequiredFields,
        "validateFetchDeviceDetailsRequestBody"
    )
};

module.exports = {
    validateRequestBodyMiddlewares
};

