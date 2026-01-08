// ========== 👑 ADMIN PANEL ROUTES ==========


const express = require("express");
const adminRoutes = express.Router();
const { ADMIN_ROUTES } = require("@configs/uri.config");

const {
  CREATE_ADMIN, 
  ACTIVATE_ADMIN, 
  DEACTIVATE_ADMIN, 
  CHANGE_SUPERVISOR, 
  UPDATE_ADMIN_DETAILS, 
  FETCH_ADMIN_DETAILS, 
  FETCH_ADMINS_LIST,
  UPDATE_MY_DETAILS, 
  VIEW_MY_DETAILS, 
  UPDATE_ADMIN_ROLE, 
  GET_ADMIN_DASHBOARD_STATS
} = ADMIN_ROUTES;

// Create Admin
const { adminControllers } = require("@controllers/admins/index");
const { commonMiddlewares } = require("@middlewares/common/index"); 
const { adminMiddlewares } = require("@middlewares/admins/index");
const { baseMiddlewares } = require("./middleware.gateway");

// Rate Limiters
const {
  createAdminLimiter,
  activateAdminLimiter,
  deactivateAdminLimiter,
  changeSupervisorLimiter,
  updateAdminDetailsLimiter,
  fetchAdminDetailsLimiter,
  fetchAdminsListLimiter,
  updateMyDetailsLimiter,
  viewMyDetailsLimiter,
  updateAdminRoleLimiter,
  getAdminDashboardStatsLimiter
} = require("@/rate-limiters/index");

adminRoutes.post(`${CREATE_ADMIN}`,
  [
    createAdminLimiter,
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins,
    commonMiddlewares.hierarchyGuard, 
    commonMiddlewares.authModeValidator,
    adminMiddlewares.validateCreateAdminRequestBody,
    adminMiddlewares.validateCreateAdminFields
  ] , 
  adminControllers.createAdmin);

adminRoutes.patch(`${ACTIVATE_ADMIN}`,
  [
    activateAdminLimiter,
    ...baseMiddlewares,
    commonMiddlewares.onlySuperAdmins,
    commonMiddlewares.authModeValidator,                  // Validate email/phone/userId
    adminMiddlewares.validateActivateAdminRequestBody, // Validate reason + notes
    adminMiddlewares.validateActivateAdminFields,
    commonMiddlewares.fetchAdminMiddleware,               // Fetch target admin
    commonMiddlewares.hierarchyGuard                       // Check hierarchy
  ],
  adminControllers.activateAdmin);

adminRoutes.delete(`${DEACTIVATE_ADMIN}`,
  [
    deactivateAdminLimiter,
    ...baseMiddlewares,
    commonMiddlewares.onlySuperAdmins,
    commonMiddlewares.authModeValidator,                    // Validate email/phone/userId
    adminMiddlewares.validateDeactivateAdminRequestBody, // Validate reason + notes
    adminMiddlewares.validateDeactivateAdminFields,
    commonMiddlewares.fetchAdminMiddleware,                 // Fetch target admin
    commonMiddlewares.hierarchyGuard                         // Check hierarchy
  ],
  adminControllers.deactivateAdmin
);

// ========== � CHANGE SUPERVISOR ROUTE ==========

// Change supervisor of an admin
adminRoutes.patch(`${CHANGE_SUPERVISOR}`,
  [
    changeSupervisorLimiter,
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins,
    commonMiddlewares.authModeValidator,                   // Validate email/phone/userId
    adminMiddlewares.validateChangeSupervisorRequestBody,  // Validate newSupervisorId + reason
    adminMiddlewares.validateChangeSupervisorFields,
    commonMiddlewares.fetchAdminMiddleware,                // Fetch target admin
    commonMiddlewares.hierarchyGuard                        // Check hierarchy
  ],
  adminControllers.changeSupervisor
);

// Update admin details
adminRoutes.patch(`${UPDATE_ADMIN_DETAILS}`,
  [
    updateAdminDetailsLimiter,
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins,
    commonMiddlewares.authModeValidator,                  // Validate email/phone/userId
    adminMiddlewares.validateUpdateAdminDetailsRequestBody, // Validate updatable fields + reason
    adminMiddlewares.validateUpdateAdminDetailsFields,
    commonMiddlewares.fetchAdminMiddleware,               // Fetch target admin
    commonMiddlewares.hierarchyGuard                       // Check hierarchy
  ],
  adminControllers.updateAdminDetails
);

// Fetch admin details
adminRoutes.get(`${FETCH_ADMIN_DETAILS}`,
  [
    fetchAdminDetailsLimiter,
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins,
    commonMiddlewares.authModeValidator,        // Validate email/phone/userId
    adminMiddlewares.validateFetchAdminDetailsRequestBody, // Validate reason
    adminMiddlewares.validateFetchAdminDetailsFields,
    commonMiddlewares.fetchAdminMiddleware,     // Fetch target admin
    commonMiddlewares.hierarchyGuard             // Check hierarchy
  ],
  adminControllers.viewAdminDetails
);

// List admins
adminRoutes.get(`${FETCH_ADMINS_LIST}`,
  [
    fetchAdminsListLimiter,
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins
  ],
  adminControllers.listAdmins
);

// Update own admin details
adminRoutes.patch(`${UPDATE_MY_DETAILS}`,
  [
    updateMyDetailsLimiter,
    ...baseMiddlewares
  ],
  adminControllers.updateOwnAdminDetails
);

// View own admin details
adminRoutes.get(`${VIEW_MY_DETAILS}`,
  [
    viewMyDetailsLimiter,
    ...baseMiddlewares
  ],
  adminControllers.viewOwnAdminDetails
);

adminRoutes.patch(`${UPDATE_ADMIN_ROLE}`,
  [
    updateAdminRoleLimiter,
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins,
    commonMiddlewares.authModeValidator,                  // Validate email/phone/userId
    adminMiddlewares.validateUpdateAdminRoleRequestBody, // Validate new role + reason
    adminMiddlewares.validateUpdateAdminRoleFields,
    commonMiddlewares.fetchAdminMiddleware,               // Fetch target admin
    commonMiddlewares.hierarchyGuard                       // Check hierarchy
  ],
  adminControllers.updateAdminRole
);

adminRoutes.get(`${GET_ADMIN_DASHBOARD_STATS}`,
  [
    getAdminDashboardStatsLimiter,
    ...baseMiddlewares,
    commonMiddlewares.onlySuperAdmins
  ],
  adminControllers.getAdminDashboardStats
);

module.exports = {
  adminRoutes
}