// ========== 👑 ADMIN PANEL ROUTES ==========


const express = require("express");
const adminRoutes = express.Router();
const { ADMIN_ROUTES } = require("@configs/uri.config");

const {
  CREATE_ADMIN, ACTIVATE_ADMIN, DEACTIVATE_ADMIN,
  CREATE_DEACTIVATION_REQUEST, LIST_DEACTIVATION_REQUESTS, 
  APPROVE_DEACTIVATION_REQUEST, REJECT_DEACTIVATION_REQUEST,
  CREATE_ACTIVATION_REQUEST, LIST_ACTIVATION_REQUESTS,
  APPROVE_ACTIVATION_REQUEST, REJECT_ACTIVATION_REQUEST,
  VIEW_STATUS_REQUEST
} = ADMIN_ROUTES.ADMINS;

// Create Admin
const { adminControllers } = require("@/controllers/admins/index");
const { commonMiddlewares } = require("@middlewares/common/index"); 
const { adminMiddlewares } = require("@middlewares/admins/index");
const { mockAuthMiddleware } = require("@testing/mock-auth.testing.middleware");

const baseMiddlerwares = [
  commonMiddlewares.verifyDeviceField,
  mockAuthMiddleware,
//  commonMiddlewares.validateRedisPayloadMiddleware,
//  commonMiddlewares.validateJwtPayloadMiddleware,
//  commonMiddlewares.verifyJWTSignature,
  commonMiddlewares.isAdmin,
  commonMiddlewares.isAdminAccountActive,
];

adminRoutes.post(`${CREATE_ADMIN}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.midAdminsAndSuperAdmins,
    adminMiddlewares.hierarchyGuard, 
    commonMiddlewares.authModeValidator,
    adminMiddlewares.validateCreateAdminRequestBody
  ] , 
  adminControllers.createAdmin);

adminRoutes.patch(`${ACTIVATE_ADMIN}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.midAdminsAndSuperAdmins,
    commonMiddlewares.authModeValidator,                  // Validate email/phone/userId
    ...adminMiddlewares.validateActivateAdminRequestBody, // Validate reason + notes
    commonMiddlewares.fetchAdminMiddleware,               // Fetch target admin
    adminMiddlewares.hierarchyGuard                       // Check hierarchy
  ],
  adminControllers.activateAdmin);

adminRoutes.patch(`${DEACTIVATE_ADMIN}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.midAdminsAndSuperAdmins,
    commonMiddlewares.authModeValidator,                    // Validate email/phone/userId
    ...adminMiddlewares.validateDeactivateAdminRequestBody, // Validate reason + notes
    commonMiddlewares.fetchAdminMiddleware,                 // Fetch target admin
    adminMiddlewares.hierarchyGuard                         // Check hierarchy
  ],
  adminControllers.deactivateAdmin
);

// ========== 🔄 DEACTIVATION REQUEST ROUTES ==========

// Create deactivation request (self)
adminRoutes.post(`${CREATE_DEACTIVATION_REQUEST}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.validateStatusRequestBody
  ],
  adminControllers.createDeactivationRequest
);

// List all deactivation requests
adminRoutes.get(`${LIST_DEACTIVATION_REQUESTS}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.midAdminsAndSuperAdmins
  ],
  adminControllers.listDeactivationRequests
);

// Approve deactivation request
adminRoutes.post(`${APPROVE_DEACTIVATION_REQUEST}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.midAdminsAndSuperAdmins,
    adminMiddlewares.validateReviewRequestBody
  ],
  adminControllers.approveDeactivationRequest
);

// Reject deactivation request
adminRoutes.post(`${REJECT_DEACTIVATION_REQUEST}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.midAdminsAndSuperAdmins,
    adminMiddlewares.validateReviewRequestBody
  ],
  adminControllers.rejectDeactivationRequest
);

// ========== 🔄 ACTIVATION REQUEST ROUTES ==========

// Create activation request (self)
adminRoutes.post(`${CREATE_ACTIVATION_REQUEST}`,
  [
    commonMiddlewares.verifyDeviceField,
    mockAuthMiddleware,
    commonMiddlewares.isAdmin,
    // Note: isAdminAccountActive removed so inactive admins can request
    adminMiddlewares.validateStatusRequestBody
  ],
  adminControllers.createActivationRequest
);

// List all activation requests
adminRoutes.get(`${LIST_ACTIVATION_REQUESTS}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.midAdminsAndSuperAdmins
  ],
  adminControllers.listActivationRequests
);

// Approve activation request
adminRoutes.post(`${APPROVE_ACTIVATION_REQUEST}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.midAdminsAndSuperAdmins,
    adminMiddlewares.validateReviewRequestBody
  ],
  adminControllers.approveActivationRequest
);

// Reject activation request
adminRoutes.post(`${REJECT_ACTIVATION_REQUEST}`,
  [
    ...baseMiddlerwares,
    adminMiddlewares.midAdminsAndSuperAdmins,
    adminMiddlewares.validateReviewRequestBody
  ],
  adminControllers.rejectActivationRequest
);

// ========== 👁️ VIEW STATUS REQUEST (UNIFIED) ==========
// View any status request (activation or deactivation) by requestId
adminRoutes.get(`${VIEW_STATUS_REQUEST}`,
  [
    ...baseMiddlerwares
    // Hierarchical access control handled inside controller based on request type
  ],
  adminControllers.viewStatusRequest
);

module.exports = {
  adminRoutes
}