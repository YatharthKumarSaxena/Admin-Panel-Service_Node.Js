const { logWithTime } = require("../../utils/time-stamps.utils");
const { errorMessage, throwInternalServerError, throwResourceNotFoundError, logMiddlewareError } = require("../../configs/error-handler.configs");
const { validateUUID, validateDeviceNameLength } = require("../../utils/fieldValidators.utils");
const { DeviceTypeHelper } = require("../../utils/enumValidators.utils");

const verifyDeviceField = async (req,res,next) => {
    try{
        const deviceId = req.headers["x-device-uuid"];
        let deviceName = req.headers["x-device-name"]; // Optional
        const deviceType = req.headers["x-device-type"]; // Optional
        // Device ID is mandatory
        if (!deviceId || deviceId.trim() === "") {
            logMiddlewareError("verifyDeviceField", "Missing device UUID in headers", req);
            return throwResourceNotFoundError(res, "Device UUID (x-device-uuid) is required in request headers");
        }
        // Attach to request object for later use in controller
        req.deviceId = deviceId.trim();
        if (!validateUUID(res, req.deviceId)) {
            logMiddlewareError("verifyDeviceField", "Invalid Device ID", req);
            return;
        }
        if (deviceName && deviceName.trim() !== "") {
            deviceName = deviceName.trim();
            if (!validateDeviceNameLength(res, deviceName)) {
                logMiddlewareError("verifyDeviceField", "Invalid Device Name", req);
                return;
            }
            req.deviceName = deviceName;
        }
        if (deviceType && deviceType.trim() !=="") {
            const type = deviceType.toUpperCase().trim();
            if (!DeviceTypeHelper.validate(type, res)) {
                logMiddlewareError("verifyDeviceField", "Invalid Device Type", req);
                return;
            }
            req.deviceType = type;
        }
        return next(); // Pass control to the next middleware/controller
    } catch (err) {
        const deviceId = req.headers["x-device-uuid"] || "Unauthorized Device ID";
        logWithTime(`⚠️ Error occurred while validating the Device field having device id: ${deviceId}`);
        errorMessage(err);
        return throwInternalServerError(res);
    }
}

module.exports = {
    verifyDeviceField
}