const { logWithTime } = require("../../utils/time-stamps.utils");
const { errorMessage, throwInternalServerError, throwAccessDeniedError, logMiddlewareError, throwResourceNotFoundError, throwInvalidResourceError } = require("../../configs/error-handler.configs");
const {  } = require("../../utils/validatorsFactory.utils");

const verifyDeviceField = async (req,res,next) => {
    try{
        const deviceID = req.headers["x-device-uuid"];
        let deviceName = req.headers["x-device-name"]; // Optional
        const deviceType = req.headers["x-device-type"]; // Optional
        // Device ID is mandatory
        if (!deviceID || deviceID.trim() === "") {
            logWithTime("Verify Device Field, Device ID field Missing");
            return throwResourceNotFoundError(res, "Device UUID (x-device-uuid) is required in request headers");
        }
        // Attach to request object for later use in controller
        req.deviceID = deviceID.trim();
        if (!isValidRegex(deviceID,UUID_V4_REGEX)) {
            logMiddlewareError("Verify Device Field, Invalid Device ID format",req);
            return throwInvalidResourceError(res, `Device UUID, Provided Device UUID (${req.deviceID}) is not in a valid UUID v4 format`);
        }
        if (deviceName && deviceName.trim() !== "") {
            deviceName = deviceName.trim();
            if(!validateLength(deviceName,deviceNameLength.min,deviceNameLength.max)){
                logMiddlewareError(`Verify Device Field, Invalid Device Name length.`,req);
                return throwAccessDeniedError(res, `Device Name length should be between ${deviceNameLength.min} and ${deviceNameLength.max} characters`);
            }
        }
        if (deviceType && deviceType.trim() !=="") {
            const type = deviceType.toUpperCase().trim();
            if (!DEVICE_TYPES.includes(type)) {
                logMiddlewareError("Verify Device Field, Invalid Device Type Provided",req);
                return throwInvalidResourceError(res, `Device Type. Use Valid Device Type: ${DEVICE_TYPES}`);
            }
            req.deviceType = type;
        }
        return next(); // Pass control to the next middleware/controller
    }catch(err){
        const deviceID = req.headers["x-device-uuid"] || "Unauthorized Device ID"
        logWithTime(`⚠️ Error occurred while validating the Device field having device id: ${deviceID}`);
        errorMessage(err);
        return throwInternalServerError(res);
    }
}

module.exports = {
    verifyDeviceField
}