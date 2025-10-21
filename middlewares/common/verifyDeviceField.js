const { logWithTime } = require("../../utils/time-stamps.utils");
const { errorMessage, throwInternalServerError, throwResourceNotFoundError, logMiddlewareError } = require("../../configs/error-handler.configs");
const { validateUUID, validateDeviceNameLength } = require("../../utils/fieldValidators.utils");
const { DeviceTypeHelper } = require("../../utils/enumValidators.utils");

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
        if(!validateUUID(res,req.deviceID)){
            logMiddlewareError("Verify Device Field",req);
            return;
        }
        if (deviceName && deviceName.trim() !== "") {
            deviceName = deviceName.trim();
            if(!validateDeviceNameLength(res,deviceName)){
                logMiddlewareError("Verify Device Field",req);
                return;
            }
            req.deviceName = deviceName;
        }
        if (deviceType && deviceType.trim() !=="") {
            const type = deviceType.toUpperCase().trim();
            if(!DeviceTypeHelper.validate(type,res)){
                logMiddlewareError("Verify Device Field",req);
                return;
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