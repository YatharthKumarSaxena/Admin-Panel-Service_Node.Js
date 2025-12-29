const { isValidRegex } = require("./validators-factory.util");
const { logWithTime } = require("./time-stamps.util");
const { UUID_V4_REGEX } = require("@configs/regex.config");
const { throwInvalidResourceError } = require("@utils/error-handler.util");

const validateUUID = (res, uuid) => {
  if (!isValidRegex(uuid, UUID_V4_REGEX)) {
    logWithTime("❌ [validateUUID] UUID format invalid");
    throwInvalidResourceError(res, "UUID", "UUID must follow v4 format like xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.");
    return false;
  }
  logWithTime("✅ [validateUUID] UUID format valid");
  return true;
};

module.exports = {
  validateUUID
};
