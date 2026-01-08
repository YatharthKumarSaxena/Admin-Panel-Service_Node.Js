// ========== 👑 DEVICE ROUTES ==========


const express = require("express");
const deviceRoutes = express.Router();
const { DEVICE_ROUTES } = require("@configs/uri.config");

const {
    VIEW_DEVICE_DETAILS,
    LIST_DEVICES,
    BLOCK_DEVICE,
    UNBLOCK_DEVICE
} = DEVICE_ROUTES;

// Device Controllers
const { deviceControllers } = require("@controllers/devices/index");

// Device Middlewares
const { deviceMiddlewares } = require("@middlewares/devices/index");

// Rate Limiters
const { 
    getDeviceDetailsLimiter,
    listDevicesLimiter,
    blockDeviceLimiter,
    unblockDeviceLimiter
} = require("@/rate-limiters/index");

const { baseMiddlewares } = require("./middleware.gateway");

// View Device Details
deviceRoutes.get(`${VIEW_DEVICE_DETAILS}`,
    [
        getDeviceDetailsLimiter,
        ...baseMiddlewares,
        deviceMiddlewares.validateFetchDeviceDetailsRequestBody,
        deviceMiddlewares.validateFetchDeviceDetailsFields
    ],
    deviceControllers.viewDeviceDetails);

// List Devices
deviceRoutes.get(`${LIST_DEVICES}`,
    [
        listDevicesLimiter,
        ...baseMiddlewares
    ],
    deviceControllers.listDevices);

// Block Device
deviceRoutes.patch(`${BLOCK_DEVICE}`,
    [
        blockDeviceLimiter,
        ...baseMiddlewares,
        deviceMiddlewares.validateBlockDeviceRequestBody,
        deviceMiddlewares.validateBlockDeviceFields
    ],
    deviceControllers.blockDevice);

// Unblock Device
deviceRoutes.patch(`${UNBLOCK_DEVICE}`,
    [
        unblockDeviceLimiter,
        ...baseMiddlewares,
        deviceMiddlewares.validateUnblockDeviceRequestBody,
        deviceMiddlewares.validateUnblockDeviceFields
    ],
    deviceControllers.unblockDevice);

module.exports = {
    deviceRoutes
};