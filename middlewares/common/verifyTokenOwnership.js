const { createClient } = require("redis");
const jwt = require("jsonwebtoken");
const {
  throwAccessDeniedError,
  throwInternalServerError,
  throwSessionExpiredError
} = require("../../configs/error-handler.configs");
const { extractAccessToken } = require("../utils/extract-token.utils");
const { logWithTime } = require("../utils/time-stamps.utils");
const { FORBIDDEN } = require("../configs/http-status.config");
const UserModel = require("../../models/user.model");
const AdminModel = require("../../models/admin.model");
const redis = createClient(); // Inject via DI if needed

const verifyTokenRedis = async (req, res, next) => {
  try {
    const accessToken = extractAccessToken(req);
    const deviceID = req.deviceID;

    if (!accessToken) {
      logWithTime("❌ Access token missing in request");
      return throwSessionExpiredError(res);
    }

    let decodedAccess;
    try {
      decodedAccess = jwt.decode(accessToken);
      if (!decodedAccess?.id) throw new Error("Invalid access token payload");
    } catch {
      logWithTime("❌ Failed to decode access token");
      return throwAccessDeniedError(res, "Invalid access token");
    }

    if (!redis.isOpen) await redis.connect();

    const redisKey = `auth:token:${decodedAccess.id}:${deviceID}`;
    const tokenDataRaw = await redis.get(redisKey);

    if (!tokenDataRaw) {
      logWithTime(`⚠️ Redis entry not found for userID: ${decodedAccess.id}, deviceID: ${deviceID}`);
      return throwSessionExpiredError(res);
    }

    const tokenData = JSON.parse(tokenDataRaw);
    const now = Date.now();

    // 🔐 Token mismatch check
    if (tokenData.accessToken && tokenData.accessToken !== accessToken) {
      const redisDecoded = jwt.decode(tokenData.accessToken);
      if (!redisDecoded?.id || redisDecoded.id !== decodedAccess.id) {
        logWithTime("❌ Redis token belongs to different userID");
        return throwAccessDeniedError(res, "Token mismatch or exploit detected");
      }

      logWithTime(`🔄 Redis has newer token for userID: ${decodedAccess.id}, syncing frontend`);
      return res.status(FORBIDDEN).send({
        success: false,
        message: "Access token mismatch",
        reason: "Please refresh your session to sync latest token"
      });
    }

    // ⏳ Access token expiry check
    if (tokenData.accessExpiry && tokenData.accessExpiry < now) {
      logWithTime(`⚠️ Access token expired for userID: ${decodedAccess.id}`);

      let decodedRefresh;
      try {
        decodedRefresh = jwt.decode(tokenData.refreshToken);
        if (!decodedRefresh?.id || decodedRefresh.id !== decodedAccess.id) {
          logWithTime("❌ Refresh token belongs to different user");
          return throwAccessDeniedError(res, "Refresh token exploit detected");
        }
      } catch {
        logWithTime("❌ Failed to decode refresh token");
        return throwAccessDeniedError(res, "Invalid refresh token");
      }

      if (!tokenData.refreshExpiry || tokenData.refreshExpiry < now) {
        logWithTime(`❌ Refresh token also expired for userID: ${decodedAccess.id}`);
        return res.status(FORBIDDEN).send({
          success: false,
          message: "Session expired",
          reason: "Please login again to continue"
        });
      }

      logWithTime(`🔁 Access expired but refresh valid — trigger rotation`);
      return res.status(FORBIDDEN).send({
        success: false,
        message: "Access token expired",
        reason: "Please refresh your session"
      });
    }

    // ✅ Token is valid
    req.user = {
      userID: decodedAccess.id,
      deviceID,
      ip: tokenData.ip || req.ip,
      userAgent: tokenData.userAgent || req.headers["user-agent"]
    };

    logWithTime(`✅ Token verified for userID: ${decodedAccess.id}, deviceID: ${deviceID}`);
    next();
  } catch (err) {
    logWithTime("❌ Internal error during Redis token verification");
    console.error(err);
    return throwInternalServerError(res);
  }
};

module.exports = { verifyTokenRedis };
