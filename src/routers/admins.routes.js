// ========== 👑 ADMIN PANEL ROUTES ==========


const express = require("express");
const adminRoutes = express.Router();
const { ADMIN_ROUTES } = require("@configs/uri.config");

const {
  CREATE_ADMIN, ACTIVATE_ADMIN, DEACTIVATE_ADMIN, 
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
)

adminRoutes.patch(`${UP}`)
module.exports = {
  adminRoutes
}