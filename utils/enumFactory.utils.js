// ✅ Enum Helpers using Factory Design Pattern
const { isValidEnumValue, getEnumKeyByValue } = require("./enumFactory.utils");
const { logWithTime } = require("./time-stamps");

const {
  AdminActionReasons,
  BlockReasons,
  UnblockReasons,
  BlockVia,
  UnblockVia,
  UserType
} = require("../configs/enums.config");

/**
 * 🏭 Factory to create enum helper with tracing
 * @param {Object} enumObj - The frozen enum object
 * @param {String} name - Enum name for logging context
 */
const createEnumHelper = (enumObj, name) => ({
  validate: (value) => {
    const result = isValidEnumValue(enumObj, value);
    logWithTime(`[${name}] validate("${value}") →`, result);
    return result;
  },
  reverseLookup: (value) => {
    const result = getEnumKeyByValue(enumObj, value);
    logWithTime(`[${name}] reverseLookup("${value}") →`, result);
    return result;
  }
});

// 🧩 Enum-specific helpers
const AdminActionHelper = createEnumHelper(AdminActionReasons, "AdminActionReasons");
const BlockReasonHelper = createEnumHelper(BlockReasons, "BlockReasons");
const UnblockReasonHelper = createEnumHelper(UnblockReasons, "UnblockReasons");
const BlockViaHelper = createEnumHelper(BlockVia, "BlockVia");
const UnblockViaHelper = createEnumHelper(UnblockVia, "UnblockVia");
const UserTypeHelper = createEnumHelper(UserType, "UserType");

module.exports = {
  AdminActionHelper,
  BlockReasonHelper,
  UnblockReasonHelper,
  BlockViaHelper,
  UnblockViaHelper,
  UserTypeHelper
};
