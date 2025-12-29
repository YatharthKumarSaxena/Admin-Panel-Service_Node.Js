const { validateLength, isValidRegex } = require("./validators-factory.util");
const { logWithTime } = require("./time-stamps.util");
const { emailRegex } = require("../configs/regex.config");
const { emailLength } = require("../configs/fields-length.config");
const { throwInvalidResourceError } = require("../utils/error-handler.util");

const validateEmailLength = (res, email) => {
  if (!validateLength(email, emailLength.min, emailLength.max)) {
    logWithTime("❌ [validateEmailLength] Email length invalid");
    throwInvalidResourceError(res, "email", `Email must be between ${emailLength.min} and ${emailLength.max} characters.`);
    return false;
  }
  logWithTime("✅ [validateEmailLength] Email length valid");
  return true;
};

const validateEmailRegex = (res, email) => {
  if (!isValidRegex(email, emailRegex)) {
    logWithTime("❌ [validateEmailRegex] Email format invalid");
    throwInvalidResourceError(res, "email", "Email must follow format like example@domain.com.");
    return false;
  }
  logWithTime("✅ [validateEmailRegex] Email format valid");
  return true;
};

const validateEmail = (res, email) => {
  return validateEmailLength(res, email) && validateEmailRegex(res, email);
};

module.exports = {
  validateEmail
};
