const express = require("express");
const internalRoutes = express.Router();

// Controllers
const internalControllers = require("@controllers/internals");

// Middlewares
const internalMiddlewares = require("@middlewares/internals");

// Routes Config
const { INTERNAL_ROUTES } = require("@configs/uri.config");

const {
  BLOCK_DEVICE,
  UNBLOCK_DEVICE
} = INTERNAL_ROUTES;

/**
 * 🔒 Block Device - Internal API
 * POST /api/internals/block-device
 * Body: { userId, deviceId, reason, reasonDetails?, blockedBy? }
 */
internalRoutes.post(
  `${BLOCK_DEVICE}`,
  [
    internalMiddlewares.validateBlockDeviceFields,
    internalMiddlewares.validateBlockDeviceRequestBody
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
    internalMiddlewares.validateUnblockDeviceFields,
    internalMiddlewares.validateUnblockDeviceRequestBody
  ],
  internalControllers.unblockDevice
);

module.exports = internalRoutes;
