const { isValidRegex } = require("./validators-factory.util");
const { logWithTime } = require("./time-stamps.util");
const { mongoIdRegex } = require("@configs/regex.config");
const { throwInvalidResourceError } = require("@utils/error-handler.util");

const validateMongoID = (res, mongoID) => {
  if (!isValidRegex(mongoID, mongoIdRegex)) {
    logWithTime(`❌ [validateMongoID] ${mongoID} Mongo ID format invalid`);
    throwInvalidResourceError(res, "Mongo ID", "Mongo ID must be a 24-character hexadecimal string.");
    return false;
  }
  logWithTime("✅ [validateMongoID] Mongo ID format valid");
  return true;
};

module.exports = {
  validateMongoID
};
