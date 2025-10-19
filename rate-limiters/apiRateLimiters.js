// middlewares/rate-limiters/apiRateLimiters.js
const { createRateLimiter } = require("./createRateLimiter");
const config = require("../configs/rate-limit.config");

module.exports = {
  blockUserLimiter: createRateLimiter(config.blockUserAccount),
  unblockUserLimiter: createRateLimiter(config.unblockUserAccount),
  getUserAuthLogsLimiter: createRateLimiter(config.getUserAuthLogs),
  fetchUserDetailsByAdminLimiter: createRateLimiter(config.fetchUserDetailsByAdmin),
  checkUserDeviceSessionsLimiter: createRateLimiter(config.checkUserDeviceSessions)
};
