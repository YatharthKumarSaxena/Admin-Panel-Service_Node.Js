const { validateLength, isValidRegex } = require("./validators-factory.util");
const { logWithTime } = require("./time-stamps.util");
const { fullPhoneNumberRegex } = require("../configs/regex.config");
const { fullPhoneNumberLength } = require("../configs/fields-length.config");
const { throwInvalidResourceError } = require("../utils/error-handler.util");

const validatePhoneLength = (res, phoneNumber) => {
  if (!validateLength(phoneNumber, fullPhoneNumberLength.min, fullPhoneNumberLength.max)) {
    logWithTime("❌ [validatePhoneLength] Phone number length invalid");
    throwInvalidResourceError(res, "phone number", `Phone number must be exactly ${fullPhoneNumberLength.min} digits.`);
    return false;
  }
  logWithTime("✅ [validatePhoneLength] Phone number length valid");
  return true;
};

const validatePhoneRegex = (res, phoneNumber) => {
  if (!isValidRegex(phoneNumber, fullPhoneNumberRegex)) {
    logWithTime("❌ [validatePhoneRegex] Phone number format invalid");
    throwInvalidResourceError(res, "phone number", "Phone number must start with country code and contain only digits.");
    return false;
  }
  logWithTime("✅ [validatePhoneRegex] Phone number format valid");
  return true;
};

const validatePhone = (res, phoneNumber) => {
  return validatePhoneLength(res, phoneNumber) && validatePhoneRegex(res, phoneNumber);
};

module.exports = {
  validatePhoneLength,
  validatePhoneRegex,
  validatePhone
};
