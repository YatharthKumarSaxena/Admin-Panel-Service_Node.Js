const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, throwResourceNotFoundError, logMiddlewareError, throwBadRequestError } = require("@utils/error-handler.util");
const { isValidUUID, isValidDeviceNameLength } = require("@utils/id-validators.util");
const { DeviceTypeHelper } = require("@utils/enum-validators.util");

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
        
        if (!!isValidUUID(req.deviceId)) {
            logMiddlewareError("verifyDeviceField", "Invalid Device ID format", req);
            return throwBadRequestError(res, "Invalid deviceId format. Must be a valid UUID v4");
        }

        if (deviceName && deviceName.trim() !== "") {
            deviceName = deviceName.trim();
            if (!isValidDeviceNameLength(deviceName)) {
                logMiddlewareError("verifyDeviceField", "Invalid Device Name length", req);
                return throwBadRequestError(res, `Device name must be between ${deviceFieldsLength.deviceName.min} and ${deviceFieldsLength.deviceName.max} characters`);
            }
            req.deviceName = deviceName;
        }

        if (deviceType && deviceType.trim() !=="") {
            const type = deviceType.toLowerCase().trim();
            if (!DeviceTypeHelper.validate(type)) {
                logMiddlewareError("verifyDeviceField", "Invalid Device Type", req);
                const validTypes = DeviceTypeHelper.getValidValues().join(', ');
                return throwBadRequestError(res, `Invalid device type. Must be one of: ${validTypes}`);
            }
            req.deviceType = type;
        }
        logWithTime(`✅ Device field verification passed for device ID: ${req.deviceId}`);
        return next(); // Pass control to the next middleware/controller
    } catch (err) {
        const deviceId = req.headers["x-device-uuid"] || "Unauthorized Device ID";
        logWithTime(`⚠️ Error occurred while validating the Device field having device id: ${deviceId}`);
        return throwInternalServerError(res, err);
    }
}

module.exports = {
    verifyDeviceField
}