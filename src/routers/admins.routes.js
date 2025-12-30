// ========== 👑 ADMIN PANEL ROUTES ==========


const express = require("express");
const adminRoutes = express.Router();
const { ADMIN_ROUTES } = require("@configs/uri.config");

const {
  CREATE_ADMIN
} = ADMIN_ROUTES.ADMINS;

// Create Admin
const { createAdmin } = require("@controllers/admins/create-admin");
const { commonMiddlewares } = require("@middlewares/common/index"); 
const {
  adminMiddlewares
} = require("@middlewares/admins/index");

const baseMiddlerwares = [
  commonMiddlewares.verifyDeviceField,
  commonMiddlewares.validateRedisPayloadMiddleware,
  commonMiddlewares.validateJwtPayloadMiddleware,
  commonMiddlewares.verifyJWTSignature,
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
  createAdmin);


module.exports = {
  adminRoutes
}