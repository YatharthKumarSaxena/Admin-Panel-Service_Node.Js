const {
  throwAccessDeniedError,
  logMiddlewareError,
  throwInternalServerError
} = require("../../configs/error-handler.configs");
const { logWithTime } = require("../../utils/time-stamps.util");
const { tokenPayloads } = require("../../configs/token.config");
const {
  validateUUID,
  validateCustomID,
  validateMongoID
} = require("../../utils/fieldValidators.util");
const { validateObjectShape } = require("../../utils/objectShapeValidator.util");

const validateJwtPayloadMiddleware = (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.tokenMeta;

    // 📋 Required fields
    const requiredFields = tokenPayloads;

    // 🧩 Shape validation
    if (
      !validateObjectShape(accessToken, requiredFields, "Access", res) ||
      !validateObjectShape(refreshToken, requiredFields, "Refresh", res)
    ) {
      logMiddlewareError("validateJwtPayloadMiddleware", "JWT payload shape validation failed", req);
      return;
    }

    // 🔍 Regex validation
    if (
      !validateUUID(accessToken.deviceId) ||
      !validateCustomID(accessToken.customId) ||
      !validateMongoID(accessToken.id)
    ) {
      logMiddlewareError("validateJwtPayloadMiddleware", "Access token regex validation failed", req);
      return;
    }

    if (
      !validateUUID(refreshToken.deviceId) ||
      !validateCustomID(refreshToken.customId) ||
      !validateMongoID(refreshToken.id)
    ) {
      logMiddlewareError("validateJwtPayloadMiddleware", "Refresh token regex validation failed", req);
      return;
    }

    // 🔁 Device ID match check
    if (accessToken.deviceId !== refreshToken.deviceId) {
      logMiddlewareError("validateJwtPayloadMiddleware", "Access and refresh token device ID mismatch", req);
      return throwAccessDeniedError(res, "Token device mismatch");
    }

    // 🔁 Custom ID match check
    if (accessToken.customId !== refreshToken.customId) {
      logMiddlewareError("validateJwtPayloadMiddleware", "Access and refresh token Custom ID mismatch", req);
      return throwAccessDeniedError(res, "Token Custom ID mismatch");
    }

    // ⏳ Expiry time check
    if (accessToken.exp >= refreshToken.exp) {
      logMiddlewareError("validateJwtPayloadMiddleware", "Access token expiry must be less than refresh token expiry", req);
      return throwAccessDeniedError(res, "Invalid token expiry structure");
    }

    logWithTime(`✅ JWT payload validated for userId: ${accessToken.id}, deviceId: ${accessToken.deviceId}`);
    return next();
  } catch (err) {
    logMiddlewareError("validateJwtPayloadMiddleware", "Internal error during JWT payload validation", req);
    return throwInternalServerError(res, err);
  }
};

module.exports = { validateJwtPayloadMiddleware };
