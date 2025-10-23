const { logWithTime } = require("./time-stamps.utils");

const setAccessTokenHeaders = (res, accessToken) => {
    if (!res || res.headersSent) {
        logWithTime("⚠️ Cannot set access token headers — response already sent or invalid res object");
        return false;
    }
    res.setHeader("x-access-token", accessToken);
    res.setHeader("x-token-refreshed", "true");
    res.setHeader("Access-Control-Expose-Headers", "x-access-token, x-token-refreshed");
    logWithTime(`🔐 Access Token headers set successfully`);
    return true;
};

const clearAccessTokenHeaders = (res) => {
    if (!res || res.headersSent) {
        logWithTime("⚠️ Cannot clear access token headers — response already sent or invalid res object");
        return false;
    }
    res.removeHeader("x-access-token");
    res.removeHeader("x-token-refreshed");
    res.setHeader("Access-Control-Expose-Headers", "x-access-token, x-token-refreshed");
    logWithTime("🧹 Access token headers cleared");
    return true;
};

const extractAccessToken = (req) => {
    const authHeader = req.headers["authorization"] || req.headers["x-access-token"];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    return token || null;
};

module.exports = {
    extractAccessToken,
    setAccessTokenHeaders,
    clearAccessTokenHeaders
};
