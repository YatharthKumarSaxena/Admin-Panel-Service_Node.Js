const jwt = require("jsonwebtoken");
const {
  throwInternalServerError,
  throwSessionExpiredError,
  throwDBResourceNotFoundError
} = require("@/responses/common/error-handler.response");
const { logWithTime } = require("@utils/time-stamps.util");
const { AdminModel, UserModel } = require("@models/index");
const { setAccessTokenHeaders, clearAccessTokenHeaders } = require("@utils/access-token.util");

const verifyJWTSignature = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, frontEndAccessToken } = req.tokenMeta;
    const deviceId = accessToken.deviceId;

    // 🔁 Compare frontend token with Redis token
    if (accessToken.token !== frontEndAccessToken) {
      logWithTime("⚠️ Frontend access token mismatch — updating with Redis token");
      setAccessTokenHeaders(res, accessToken);
    }

    // 🔐 Verify access token
    try {
      decodedAccess = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      logWithTime("⚠️ Access token expired or invalid");

      // 🔁 Try refresh token
      try {
        decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        logWithTime("✅ Refresh token valid — access expired");
        // Optionally: trigger token rotation here
      } catch (refreshErr) {
        logWithTime("❌ Both access and refresh tokens expired");
        // Clear Access Headers , M.M and Local Storage
        clearAccessTokenHeaders(res);
        return throwSessionExpiredError(res);
      }
    }

    // 🧠 Resolve identity via adminId
    const adminId = accessToken.adminId;
    let admin = await AdminModel.findOne({ adminId: adminId });

    if (!admin) {
      const user = await UserModel.findOne({ userId: adminId });
      if (!user) {
        logWithTime(`❌ No user/admin found for adminId: ${adminId}`);
        return throwDBResourceNotFoundError(res, "Identity", "No matching user or admin found");
      }

      req.admin = user;
      logWithTime(`✅ Verified user for adminId: ${adminId}, deviceId: ${deviceId}`);
    } else {
      req.admin = admin;
      logWithTime(`✅ Verified admin for adminId: ${adminId}, deviceId: ${deviceId}`);
    }

    return next();
  } catch (err) {
    logWithTime("❌ Internal error during token signature verification");
    return throwInternalServerError(res, err);
  }
};

module.exports = { verifyJWTSignature };
