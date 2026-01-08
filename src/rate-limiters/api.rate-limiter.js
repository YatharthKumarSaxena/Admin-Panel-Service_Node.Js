// middlewares/rate-limiters/apiRateLimiters.js
const { createRateLimiter } = require("./create.rate-limiter");
const { config } = require("@configs/rate-limit.config");

module.exports = {
  // ========== 👥 USER RATE LIMITERS ==========
  blockUserLimiter: createRateLimiter(config.blockUser),
  unblockUserLimiter: createRateLimiter(config.unblockUser),
  getTotalRegisteredUsersLimiter: createRateLimiter(config.getTotalRegisteredUsers),
  listUsersLimiter: createRateLimiter(config.listUsers),
  viewUserDetailsLimiter: createRateLimiter(config.viewUserDetails),
  
  // ========== 👑 ADMIN RATE LIMITERS ==========
  getAdminAuthLogsLimiter: createRateLimiter(config.getAdminAuthLogs),
  updateAdminRoleLimiter: createRateLimiter(config.updateAdminRole),
  updateAdminDetailsLimiter: createRateLimiter(config.updateAdminDetails),
  updateMyDetailsLimiter: createRateLimiter(config.updateMyDetails),
  createAdminLimiter: createRateLimiter(config.createAdmin),
  createAdminInBulkLimiter: createRateLimiter(config.createAdminInBulk),
  activateAdminLimiter: createRateLimiter(config.activateAdmin),
  deactivateAdminLimiter: createRateLimiter(config.deactivateAdmin),
  changeSupervisorLimiter: createRateLimiter(config.changeSupervisor),
  fetchAdminDetailsLimiter: createRateLimiter(config.fetchAdminDetails),
  fetchAdminsListLimiter: createRateLimiter(config.fetchAdminsList),
  viewMyDetailsLimiter: createRateLimiter(config.viewMyDetails),
  getAdminDashboardStatsLimiter: createRateLimiter(config.getAdminDashboardStats),

  // ========== 🔒 INTERNAL RATE LIMITERS ==========
  syncUserDataLimiter: createRateLimiter(config.syncUserData),
  syncDeviceDataLimiter: createRateLimiter(config.syncDeviceData),
  getUserActiveSessionsLimiter: createRateLimiter(config.getUserActiveSessions),
  fetchUserDetailsByInternalLimiter: createRateLimiter(config.fetchUserDetailsByInternal),
  getUserAuthLogsByInternalLimiter: createRateLimiter(config.getUserAuthLogsByInternal),

  // ========== 🔄 REQUEST RATE LIMITERS ==========
  listAllStatusRequestsLimiter: createRateLimiter(config.listAllStatusRequests),
  viewStatusRequestLimiter: createRateLimiter(config.viewStatusRequest),
  createDeactivationRequestLimiter: createRateLimiter(config.createDeactivationRequest),
  approveDeactivationRequestLimiter: createRateLimiter(config.approveDeactivationRequest),
  rejectDeactivationRequestLimiter: createRateLimiter(config.rejectDeactivationRequest),
  createActivationRequestLimiter: createRateLimiter(config.createActivationRequest),
  approveActivationRequestLimiter: createRateLimiter(config.approveActivationRequest),
  rejectActivationRequestLimiter: createRateLimiter(config.rejectActivationRequest),
  
  // ========== 📱 DEVICE RATE LIMITERS ==========
  viewDeviceDetailsLimiter: createRateLimiter(config.viewDeviceDetails),
  listDevicesLimiter: createRateLimiter(config.listDevices),
  blockDeviceLimiter: createRateLimiter(config.blockDevice),
  unblockDeviceLimiter: createRateLimiter(config.unblockDevice),

  // ========== 📊 ACTIVITY TRACKING RATE LIMITERS ==========
  fetchActivityLogsLimiter: createRateLimiter(config.fetchActivityLogs),
  listActivityTracksLimiter: createRateLimiter(config.listActivityTracks),
  fetchMyActivityLogsLimiter: createRateLimiter(config.fetchMyActivityLogs)
};
