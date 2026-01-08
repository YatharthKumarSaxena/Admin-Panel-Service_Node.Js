const { malformedAndWrongRequestRateLimiter, unknownRouteLimiter } = require("./global.rate-limiter");
const { 
  blockUserLimiter, 
  unblockUserLimiter, 
  checkUserDeviceSessionsLimiter, 
  fetchUserDetailsByAdminLimiter, 
  getUserAuthLogsLimiter,
  // Device Rate Limiters
  getDeviceDetailsLimiter,
  listDevicesLimiter,
  blockDeviceLimiter,
  unblockDeviceLimiter,
  createDeviceLimiter,
  updateDeviceLimiter,
  deleteDeviceLimiter,
  deactivateDeviceLimiter
} = require("./api.rate-limiter");
const { globalLimiter } = require("./global.rate-limiter");

module.exports = {
  malformedAndWrongRequestRateLimiter,
  unknownRouteLimiter,
  // User Limiters
  blockUserLimiter,
  unblockUserLimiter,
  checkUserDeviceSessionsLimiter,
  fetchUserDetailsByAdminLimiter,
  getUserAuthLogsLimiter,
  // Device Limiters
  getDeviceDetailsLimiter,
  listDevicesLimiter,
  blockDeviceLimiter,
  unblockDeviceLimiter,
  createDeviceLimiter,
  updateDeviceLimiter,
  deleteDeviceLimiter,
  deactivateDeviceLimiter,
  // Global Limiters
  globalLimiter
};

