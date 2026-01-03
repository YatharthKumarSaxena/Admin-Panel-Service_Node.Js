// ✅ Enum Helpers using Factory Design Pattern
const { isValidEnumValue, getEnumKeyByValue } = require("./validators-factory.util");
const { logWithTime } = require("./time-stamps.util");
const { throwInvalidResourceError } = require("@utils/error-handler.util")
const {
  AdminActionReasons,
  BlockReasons,
  UnblockReasons,
  BlockVia,
  UnblockVia,
  DeviceType,
  PerformedBy
} = require("@configs/enums.config");

const { tokenPayloads } = require("@configs/token.config");

/**
 * 🏭 Factory to create enum helper with boolean returns
 * Returns true/false only - caller decides response handling
 * This allows collecting multiple validation errors
 * 
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
  },
  getValidValues: () => {
    return Object.values(enumObj);
  },
  getName: () => name
});

// 🧩 Enum-specific helpers
const AdminActionHelper = createEnumHelper(AdminActionReasons, "AdminActionReasons");
const BlockReasonHelper = createEnumHelper(BlockReasons, "BlockReasons");
const UnblockReasonHelper = createEnumHelper(UnblockReasons, "UnblockReasons");
const BlockViaHelper = createEnumHelper(BlockVia, "BlockVia");
const UnblockViaHelper = createEnumHelper(UnblockVia, "UnblockVia");
const DeviceTypeHelper = createEnumHelper(DeviceType, "DeviceType");
const TokenPayloadHelper = createEnumHelper(tokenPayloads, "TokenPayloads");
const PerformedByHelper = createEnumHelper(PerformedBy,"PerformedBy")

module.exports = {
  AdminActionHelper,
  BlockReasonHelper,
  UnblockReasonHelper,
  BlockViaHelper,
  UnblockViaHelper,
  PerformedByHelper,
  DeviceTypeHelper,
  TokenPayloadHelper
};
