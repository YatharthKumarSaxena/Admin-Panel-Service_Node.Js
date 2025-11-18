// utils/identifier-validator.factory.js
const { BAD_REQUEST } = require("../configs/http-status.config");
const { logWithTime } = require("./time-stamps.util");
const { identifierKeys } = require("../configs/enums.config");

/**
 * Factory to validate single identifier for User/Admin
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {String} role - "User" or "Admin"
 * @param {String} source - "body" or "query"
 */
const validateSingleIdentifierFactory = (req, res, role = "User", source = "body") => {
  // authMode can be EMAIL / PHONE / BOTH → default BOTH
  const mode = req.authMode || "both";
  const identifiers = identifierKeys[mode][role]; // dynamic keys from config

  const data = source === "query" ? { ...req.query } : { ...req.body };

  const validIdentifiers = identifiers.filter(
    key => data.hasOwnProperty(key) && typeof data[key] === "string" && data[key].trim() !== ""
  );

  if (validIdentifiers.length !== 1) {
    logWithTime(`🧷 Invalid input: More than one or no identifier provided for ${role} from device id: (${req.deviceID}).`);
    res.status(BAD_REQUEST).send({
      success: false,
      message: `❌ Provide exactly one identifier: ${identifiers.join(", ")}`
    });
    return false;
  }

  // remove extras
  const selectedKey = validIdentifiers[0];
  identifiers.forEach(key => {
    if (key !== selectedKey && key in data) {
      delete data[key];
    }
  });

  logWithTime(`🧩 Valid identifier input detected for ${role} from device id: (${req.deviceID}).`);
  return true;
};

module.exports = { validateSingleIdentifierFactory };
