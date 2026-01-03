const {
  throwAccessDeniedError,
  logMiddlewareError,
  throwInternalServerError
} = require("@utils/error-handler.util");
const { logWithTime } = require("@utils/time-stamps.util");
const { tokenPayloads } = require("@configs/token.config");
const { isValidUUID, isValidCustomID, isValidMongoID } = require("@utils/id-validators.util");
const { validateObjectShape } = require("@utils/object-shape-validator.util");

const validateJwtPayloadMiddleware = (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.tokenMeta;

    // 📋 Required fields
    const requiredFields = tokenPayloads;

    // 🧩 Shape validation for access token
    const accessShapeResult = validateObjectShape(accessToken, requiredFields, "Access");
    if (!accessShapeResult.valid) {
      logWithTime(`❌ [validateJwtPayloadMiddleware] Access token malformed`);
      logWithTime(`Missing: ${accessShapeResult.missing.join(", ") || "None"} | Extra: ${accessShapeResult.extra.join(", ") || "None"}`);
      logMiddlewareError("validateJwtPayloadMiddleware", "Access token shape validation failed", req);
      return throwAccessDeniedError(res, "Access token payload malformed");
    }

    // 🧩 Shape validation for refresh token
    const refreshShapeResult = validateObjectShape(refreshToken, requiredFields, "Refresh");
    if (!refreshShapeResult.valid) {
      logWithTime(`❌ [validateJwtPayloadMiddleware] Refresh token malformed`);
      logWithTime(`Missing: ${refreshShapeResult.missing.join(", ") || "None"} | Extra: ${refreshShapeResult.extra.join(", ") || "None"}`);
      logMiddlewareError("validateJwtPayloadMiddleware", "Refresh token shape validation failed", req);
      return throwAccessDeniedError(res, "Refresh token payload malformed");
    }

    // 🔍 Regex validation for access token
    if (!isValidUUID(accessToken.deviceId)) {
      logWithTime(`❌ [validateJwtPayloadMiddleware] Invalid access token deviceId format`);
      logMiddlewareError("validateJwtPayloadMiddleware", "Access token deviceId validation failed", req);
      return throwAccessDeniedError(res, "Invalid access token deviceId");
    }
    
    if (!isValidCustomID(accessToken.customId)) {
      logWithTime(`❌ [validateJwtPayloadMiddleware] Invalid access token customId format`);
      logMiddlewareError("validateJwtPayloadMiddleware", "Access token customId validation failed", req);
      return throwAccessDeniedError(res, "Invalid access token customId");
    }
    if (!isValidMongoID(accessToken.id)) {
      logWithTime(`❌ [validateJwtPayloadMiddleware] Invalid access token id format`);
      logMiddlewareError("validateJwtPayloadMiddleware", "Access token id validation failed", req);
      return throwAccessDeniedError(res, "Invalid access token id");
    }

    // 🔍 Regex validation for refresh token
    if (!isValidUUID(refreshToken.deviceId)) {
      logWithTime(`❌ [validateJwtPayloadMiddleware] Invalid refresh token deviceId format`);
      logMiddlewareError("validateJwtPayloadMiddleware", "Refresh token deviceId validation failed", req);
      return throwAccessDeniedError(res, "Invalid refresh token deviceId");
    }
    if (!isValidCustomID(refreshToken.customId)) {
      logWithTime(`❌ [validateJwtPayloadMiddleware] Invalid refresh token customId format`);
      logMiddlewareError("validateJwtPayloadMiddleware", "Refresh token customId validation failed", req);
      return throwAccessDeniedError(res, "Invalid refresh token customId");
    }
    if (!isValidMongoID(refreshToken.id)) {
      logWithTime(`❌ [validateJwtPayloadMiddleware] Invalid refresh token id format`);
      logMiddlewareError("validateJwtPayloadMiddleware", "Refresh token id validation failed", req);
      return throwAccessDeniedError(res, "Invalid refresh token id");
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
