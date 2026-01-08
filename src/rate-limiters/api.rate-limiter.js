// middlewares/rate-limiters/apiRateLimiters.js
const { createRateLimiter } = require("./create.rate-limiter");
const { config } = require("@configs/rate-limit.config");

module.exports = {
  // User Rate Limiters
  blockUserLimiter: createRateLimiter(config.blockUserAccount),
  unblockUserLimiter: createRateLimiter(config.unblockUserAccount),
  getUserAuthLogsLimiter: createRateLimiter(config.getUserAuthLogs),
  fetchUserDetailsByAdminLimiter: createRateLimiter(config.fetchUserDetailsByAdmin),
  checkUserDeviceSessionsLimiter: createRateLimiter(config.checkUserDeviceSessions),
  
  // Device Rate Limiters
  getDeviceDetailsLimiter: createRateLimiter(config.getDeviceDetails),
  listDevicesLimiter: createRateLimiter(config.listDevices),
  blockDeviceLimiter: createRateLimiter(config.blockDevice),
  unblockDeviceLimiter: createRateLimiter(config.unblockDevice),
  createDeviceLimiter: createRateLimiter(config.createDevice),
  updateDeviceLimiter: createRateLimiter(config.updateDevice),
  deleteDeviceLimiter: createRateLimiter(config.deleteDevice),
  deactivateDeviceLimiter: createRateLimiter(config.deactivateDevice)
};
