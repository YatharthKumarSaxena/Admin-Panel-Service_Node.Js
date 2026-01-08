const { malformedAndWrongRequestRateLimiter, unknownRouteLimiter } = require("./global.rate-limiter");
const { 
  // User Limiters
  blockUserLimiter, 
  unblockUserLimiter, 
  getTotalRegisteredUsersLimiter,
  listUsersLimiter,
  viewUserDetailsLimiter,
  
  // Admin Limiters
  getAdminAuthLogsLimiter,
  updateAdminRoleLimiter,
  updateAdminDetailsLimiter,
  updateMyDetailsLimiter,
  createAdminLimiter,
  createAdminInBulkLimiter,
  activateAdminLimiter,
  deactivateAdminLimiter,
  changeSupervisorLimiter,
  fetchAdminDetailsLimiter,
  fetchAdminsListLimiter,
  viewMyDetailsLimiter,
  getAdminDashboardStatsLimiter,

  // Internal Limiters
  syncUserDataLimiter,
  syncDeviceDataLimiter,
  getUserActiveSessionsLimiter,
  fetchUserDetailsByInternalLimiter,
  getUserAuthLogsByInternalLimiter,

  // Request Limiters
  listAllStatusRequestsLimiter,
  viewStatusRequestLimiter,
  createDeactivationRequestLimiter,
  approveDeactivationRequestLimiter,
  rejectDeactivationRequestLimiter,
  createActivationRequestLimiter,
  approveActivationRequestLimiter,
  rejectActivationRequestLimiter,

  // Device Limiters
  viewDeviceDetailsLimiter,
  listDevicesLimiter,
  blockDeviceLimiter,
  unblockDeviceLimiter,

  // Activity Tracking Limiters
  fetchActivityLogsLimiter,
  listActivityTracksLimiter,
  fetchMyActivityLogsLimiter
} = require("./api.rate-limiter");
const { globalLimiter } = require("./global.rate-limiter");

module.exports = {
  // Global Limiters
  malformedAndWrongRequestRateLimiter,
  unknownRouteLimiter,
  globalLimiter,

  // User Limiters
  blockUserLimiter,
  unblockUserLimiter,
  getTotalRegisteredUsersLimiter,
  listUsersLimiter,
  viewUserDetailsLimiter,

  // Admin Limiters
  getAdminAuthLogsLimiter,
  updateAdminRoleLimiter,
  updateAdminDetailsLimiter,
  updateMyDetailsLimiter,
  createAdminLimiter,
  createAdminInBulkLimiter,
  activateAdminLimiter,
  deactivateAdminLimiter,
  changeSupervisorLimiter,
  fetchAdminDetailsLimiter,
  fetchAdminsListLimiter,
  viewMyDetailsLimiter,
  getAdminDashboardStatsLimiter,

  // Internal Limiters
  syncUserDataLimiter,
  syncDeviceDataLimiter,
  getUserActiveSessionsLimiter,
  fetchUserDetailsByInternalLimiter,
  getUserAuthLogsByInternalLimiter,

  // Request Limiters
  listAllStatusRequestsLimiter,
  viewStatusRequestLimiter,
  createDeactivationRequestLimiter,
  approveDeactivationRequestLimiter,
  rejectDeactivationRequestLimiter,
  createActivationRequestLimiter,
  approveActivationRequestLimiter,
  rejectActivationRequestLimiter,

  // Device Limiters
  viewDeviceDetailsLimiter,
  listDevicesLimiter,
  blockDeviceLimiter,
  unblockDeviceLimiter,

  // Activity Tracking Limiters
  fetchActivityLogsLimiter,
  listActivityTracksLimiter,
  fetchMyActivityLogsLimiter
};

