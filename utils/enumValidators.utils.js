// ✅ Enum Helpers using Factory Design Pattern
const { isValidEnumValue, getEnumKeyByValue } = require("./validatorsFactory.utils");
const { logWithTime } = require("./time-stamps.utils");
const { throwInvalidResourceError } = require("../configs/error-handler.configs")
const {
  AdminActionReasons,
  BlockReasons,
  UnblockReasons,
  BlockVia,
  UnblockVia,
  UserType,
  DeviceType
} = require("../configs/enums.config");

const { tokenPayloads } = require("../configs/token.config");
/**
 * 🏭 Factory to create enum helper with tracing
 * @param {Object} enumObj - The frozen enum object
 * @param {String} name - Enum name for logging context
 */
const createEnumHelper = (enumObj, name) => ({
  validate: (value,res) => {
    const result = isValidEnumValue(enumObj, value);
    logWithTime(`[${name}] validate("${value}") →`, result);
    if (!result) {
      throwInvalidResourceError(res, name, `"${value}" is not a valid ${name}`);
      return false;
    }
    return true;
  },
  reverseLookup: (value,res) => {
    const result = getEnumKeyByValue(enumObj, value);
    logWithTime(`[${name}] reverseLookup("${value}") →`, result);
    if (!result) {
      throwInvalidResourceError(res, name, `"${value}" is not a valid ${name}`);
      return false;
    }
    return true;
  }
});

// 🧩 Enum-specific helpers
const AdminActionHelper = createEnumHelper(AdminActionReasons, "AdminActionReasons");
const BlockReasonHelper = createEnumHelper(BlockReasons, "BlockReasons");
const UnblockReasonHelper = createEnumHelper(UnblockReasons, "UnblockReasons");
const BlockViaHelper = createEnumHelper(BlockVia, "BlockVia");
const UnblockViaHelper = createEnumHelper(UnblockVia, "UnblockVia");
const UserTypeHelper = createEnumHelper(UserType, "UserType");
const DeviceTypeHelper = createEnumHelper(DeviceType, "DeviceType");
const TokenPayloadHelper = createEnumHelper(tokenPayloads, "TokenPayloads");

module.exports = {
  AdminActionHelper,
  BlockReasonHelper,
  UnblockReasonHelper,
  BlockViaHelper,
  UnblockViaHelper,
  UserTypeHelper,
  DeviceTypeHelper,
  TokenPayloadHelper
};
