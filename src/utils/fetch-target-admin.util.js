// utils/fetch-factory.util.js
const { 
  throwInvalidResourceError, 
  throwResourceNotFoundError, 
  throwInternalServerError, 
  errorMessage, 
  logMiddlewareError, 
  getLogIdentifiers 
} = require("../configs/error-handler.configs");

const { logWithTime } = require("./time-stamps.util");

/**
 * Generic fetch factory for User/Admin
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Object} Model - Mongoose model (UserModel/AdminModel)
 * @param {Object} identifiers - identifier mapping { idKey, emailKey, phoneKey }
 * @param {String} entityName - "User" or "Admin"
 */
const fetchEntity = async (req, res, Model, identifiers, entityName) => {
  try {
    let entity;
    let verifyWith = "";
    let anyResourcePresent = true;

    if (req?.query?.[identifiers.idKey]) {
      entity = await Model.findOne({ [identifiers.idKey]: req.query[identifiers.idKey].trim() });
      if (entity) verifyWith = "ID";
    } else if (req?.query?.[identifiers.emailKey]) {
      entity = await Model.findOne({ [identifiers.emailKey]: req.query[identifiers.emailKey].trim().toLowerCase() });
      if (entity) verifyWith = "EMAIL";
    } else if (req?.query?.[identifiers.phoneKey]) {
      entity = await Model.findOne({ [identifiers.phoneKey]: req.query[identifiers.phoneKey].trim() });
      if (entity) verifyWith = "PHONE";
    } else if (req?.body?.[identifiers.idKey]) {
      entity = await Model.findOne({ [identifiers.idKey]: req.body[identifiers.idKey].trim() });
      if (entity) verifyWith = "ID";
    } else if (req?.body?.[identifiers.emailKey]) {
      entity = await Model.findOne({ [identifiers.emailKey]: req.body[identifiers.emailKey].trim().toLowerCase() });
      if (entity) verifyWith = "EMAIL";
    } else if (req?.body?.[identifiers.phoneKey]) {
      entity = await Model.findOne({ [identifiers.phoneKey]: req.body[identifiers.phoneKey].trim() });
      if (entity) verifyWith = "PHONE";
    } else {
      anyResourcePresent = false;
    }

    if (!anyResourcePresent) {
      const resource = "Phone Number, Email ID or ID (Any One)";
      logMiddlewareError(`Fetch ${entityName}, No resource provided`, req);
      throwResourceNotFoundError(res, resource);
      return verifyWith;
    }

    if (!entity) {
      logMiddlewareError(`Fetch ${entityName}, Unauthorized details provided`, req);
      throwInvalidResourceError(res, "Phone Number, Email ID or ID");
      return verifyWith;
    }

    req.verifyWith = verifyWith;
    req[`found${entityName}`] = entity;
    logWithTime(`🆔 ${entityName} identified using: ${verifyWith}`);
    return verifyWith;

  } catch (err) {
    const getIdentifiers = getLogIdentifiers(req);
    logWithTime(`❌ Internal Error while fetching ${entityName} ${getIdentifiers}`);
    errorMessage(err);
    throwInternalServerError(res);
    return "";
  }
};

module.exports = { fetchEntity };
