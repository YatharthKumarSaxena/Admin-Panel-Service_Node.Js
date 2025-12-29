// ========== 👑 ADMIN PANEL ROUTES ==========


const express = require("express");
const adminRouter = express.Router();
const { ADMIN_ROUTES } = require("@configs/uri.config");

const {
  CREATE_ADMIN
} = ADMIN_ROUTES.ADMINS;

// Create Admin
const { createAdmin } = require("@controllers/admins/create-admin");
const { commonMiddlewares } = require("@middlewares/common/index"); 

const baseMiddlerwares = [
  commonMiddlewares.verifyDeviceField,
  commonMiddlewares.validateRedisPayloadMiddleware,
  commonMiddlewares.validateJwtPayloadMiddleware,
  commonMiddlewares.verifyJWTSignature,
  commonMiddlewares.isAdmin,
  commonMiddlewares.isAdminAccountActive,
  commonMiddlewares.authModeValidator
];

adminRouter.post(`${CREATE_ADMIN}`,
  [

  ] , 
  createAdmin);


module.exports = {
  adminRouter
}