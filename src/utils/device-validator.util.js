const { validateLength } = require("./validators-factory.util");
const { logWithTime } = require("./time-stamps.util");
const { deviceNameLength } = require("../configs/fields-length.config");
const { throwInvalidResourceError } = require("../utils/error-handler.util");

const validateDeviceNameLength = (res, deviceName) => {
  if (!validateLength(deviceName, deviceNameLength.min, deviceNameLength.max)) {
    logWithTime("❌ [validateDeviceNameLength] Device name length invalid");
    throwInvalidResourceError(res, "device name", `Device name must be between ${deviceNameLength.min} and ${deviceNameLength.max} characters.`);
    return false;
  }
  logWithTime("✅ [validateDeviceNameLength] Device name length valid");
  return true;
};

module.exports = {
  validateDeviceNameLength
};
