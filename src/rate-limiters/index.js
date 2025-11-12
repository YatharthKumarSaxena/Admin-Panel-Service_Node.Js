const { malformedAndWrongRequestRateLimiter, unknownRouteLimiter } = require("./global.rate-limiter");
const { blockUserLimiter, unblockUserLimiter, checkUserDeviceSessionsLimiter, fetchUserDetailsByAdminLimiter, getUserAuthLogsLimiter } = require("./api.rate-limiter");
const { globalLimiter } = require("./global.rate-limiter");

module.exports = {
  malformedAndWrongRequestRateLimiter,
  unknownRouteLimiter,
  blockUserLimiter,
  unblockUserLimiter,
  checkUserDeviceSessionsLimiter,
  fetchUserDetailsByAdminLimiter,
  getUserAuthLogsLimiter,
  globalLimiter
};

