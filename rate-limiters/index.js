const { malformedAndWrongRequestRateLimiter, unknownRouteLimiter } = require("./deviceBasedRateLimiters");
const { blockUserLimiter, unblockUserLimiter, checkUserDeviceSessionsLimiter, fetchUserDetailsByAdminLimiter, getUserAuthLogsLimiter } = require("./apiRateLimiters");
const { globalLimiter } = require("./globalRateLimiter");

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

