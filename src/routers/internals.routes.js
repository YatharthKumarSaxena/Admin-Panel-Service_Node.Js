const express = require("express");
const internalRoutes = express.Router();

// Controllers
const { internalControllers } = require("@controllers/internals/index");
const { commonMiddlewares } = require("@middlewares/common/index"); 
// Middlewares
const { internalMiddlewares } = require("@middlewares/internals/index");
const { mockAuthMiddleware } = require("@testing/mock-auth.testing.middleware");
// Routes Config
const { INTERNAL_ROUTES } = require("@configs/uri.config");

const {
  BLOCK_DEVICE,
  UNBLOCK_DEVICE
} = INTERNAL_ROUTES;

const baseMiddlerwares = [
  commonMiddlewares.verifyDeviceField,
  mockAuthMiddleware,
//  commonMiddlewares.validateRedisPayloadMiddleware,
//  commonMiddlewares.validateJwtPayloadMiddleware,
//  commonMiddlewares.verifyJWTSignature,
  commonMiddlewares.isAdmin,
  commonMiddlewares.isAdminAccountActive,
];

/**
 * 🔒 Block Device - Internal API
 * POST /api/internals/block-device
 * Body: { userId, deviceId, reason, reasonDetails?, blockedBy? }
 */
internalRoutes.post(
  `${BLOCK_DEVICE}`,
  [
    ...baseMiddlerwares,
    internalMiddlewares.validateBlockDeviceRequestBody,
    internalMiddlewares.validateBlockDeviceFields,
  ],
  internalControllers.blockDevice
);

/**
 * 🔓 Unblock Device - Internal API
 * POST /api/internals/unblock-device
 * Body: { userId, deviceId, reason, unblockedBy? }
 */
internalRoutes.post(
  `${UNBLOCK_DEVICE}`,
  [
    ...baseMiddlerwares,
    internalMiddlewares.validateUnblockDeviceRequestBody,
    internalMiddlewares.validateUnblockDeviceFields
  ],
  internalControllers.unblockDevice
);

module.exports = internalRoutes;
