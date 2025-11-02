const { validateLength, isValidRegex } = require("./validatorsFactory.util");
const { logWithTime } = require("./time-stamps.util");
const { UUID_V4_REGEX, emailRegex, fullPhoneNumberRegex, mongoIdRegex, customIdRegex } = require("../configs/regex.config");
const { emailLength, fullPhoneNumberLength, deviceNameLength } = require("../configs/fields-length.config");
const { throwInvalidResourceError } = require("../configs/error-handler.configs");

/**
 * Validates email length
 */
const validateEmailLength = (res, email) => {
  if (!validateLength(email, emailLength.min, emailLength.max)) {
    logWithTime("❌ [validateEmailLength] Email length invalid");
    throwInvalidResourceError(res, "email", `Email must be between ${emailLength.min} and ${emailLength.max} characters.`);
    return false;
  }
  logWithTime("✅ [validateEmailLength] Email length valid");
  return true;
};

/**
 * Validates email format
 */
const validateEmailRegex = (res, email) => {
  if (!isValidRegex(email, emailRegex)) {
    logWithTime("❌ [validateEmailRegex] Email format invalid");
    throwInvalidResourceError(res, "email", "Email must follow format like example@domain.com.");
    return false;
  }
  logWithTime("✅ [validateEmailRegex] Email format valid");
  return true;
};

/**
 * Validates phone number length
 */
const validatePhoneLength = (res, phoneNumber) => {
  if (!validateLength(phoneNumber, fullPhoneNumberLength.min, fullPhoneNumberLength.max)) {
    logWithTime("❌ [validatePhoneLength] Phone number length invalid");
    throwInvalidResourceError(res, "phone number", `Phone number must be exactly ${fullPhoneNumberLength.min} digits.`);
    return false;
  }
  logWithTime("✅ [validatePhoneLength] Phone number length valid");
  return true;
};

const validateDeviceNameLength = (res, deviceName) => {
  if (!validateLength(deviceName, deviceNameLength.min, deviceNameLength.max)) {
    logWithTime("❌ [validateDeviceNameLength] Device name length invalid");
    throwInvalidResourceError(res, "device name", `Device name must be between ${deviceNameLength.min} and ${deviceNameLength.max} characters.`);
    return false;
  }
  logWithTime("✅ [validateDeviceNameLength] Device name length valid");
  return true;
};

/**
 * Validates phone number format
 */
const validatePhoneRegex = (res, phoneNumber) => {
  if (!isValidRegex(phoneNumber, fullPhoneNumberRegex)) {
    logWithTime("❌ [validatePhoneRegex] Phone number format invalid");
    throwInvalidResourceError(res, "phone number", "Phone number must start with country code and contain only digits.");
    return false;
}
  logWithTime("✅ [validatePhoneRegex] Phone number format valid");
  return true;
};

/**
 * Validates UUID format
 */
const validateUUID = (res, uuid) => {
  if (!isValidRegex(uuid, UUID_V4_REGEX)) {
    logWithTime("❌ [validateUUID] UUID format invalid");
    throwInvalidResourceError(res, "UUID", "UUID must follow v4 format like xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.");
    return false;
  }
  logWithTime("✅ [validateUUID] UUID format valid");
  return true;
};

const validateCustomID = (res, customID) => {
  if (!isValidRegex(customID, customIdRegex)) {
    logWithTime(`❌ [validateCustomID] ${customID} Custom ID format invalid`);
    throwInvalidResourceError(res, "custom ID", "Custom ID must follow format like ABC1234567.");
    return false;
  }
  logWithTime("✅ [validateCustomID] Custom ID format valid");
  return true;
};

const validateMongoID = (res, mongoID) => {
  if (!isValidRegex(mongoID, mongoIdRegex)) {
    logWithTime(`❌ [validateMongoID] ${mongoID} Mongo ID format invalid`);
    throwInvalidResourceError(res, "Mongo ID", "Mongo ID must be a 24-character hexadecimal string.");
    return false;
  }
  logWithTime("✅ [validateMongoID] Mongo ID format valid");
  return true;
}

module.exports = {
  validateEmailLength,
  validateEmailRegex,
  validatePhoneLength,
  validatePhoneRegex,
  validateUUID,
  validateDeviceNameLength,
  validateCustomID,
  validateMongoID
};

