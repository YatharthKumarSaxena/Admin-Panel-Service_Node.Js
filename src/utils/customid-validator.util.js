const { isValidRegex } = require("./validators-factory.util");
const { logWithTime } = require("./time-stamps.util");
const { customIdRegex } = require("../configs/regex.config");
const { throwInvalidResourceError } = require("../utils/error-handler.util");

const validateCustomID = (res, customID) => {
  if (!isValidRegex(customID, customIdRegex)) {
    logWithTime(`❌ [validateCustomID] ${customID} Custom ID format invalid`);
    throwInvalidResourceError(res, "custom ID", "Custom ID must follow format like ABC1234567.");
    return false;
  }
  logWithTime("✅ [validateCustomID] Custom ID format valid");
  return true;
};

module.exports = {
  validateCustomID
};
