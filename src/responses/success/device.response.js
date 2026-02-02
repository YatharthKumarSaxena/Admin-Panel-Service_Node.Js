// DEVICE SUCCESS RESPONSES

const { OK } = require("@/configs/http-status.config");

const blockDeviceSuccessResponse = (res, device, blockedBy) => {
    return res.status(OK).json({
        success: true,
        message: "Device blocked successfully.",
        data: {
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            userId: device.userId,
            isBlocked: device.isBlocked,
            blockReason: device.blockReason,
            blockedBy: device.blockedBy,
            blockedAt: device.blockedAt
        }
    });
};

const unblockDeviceSuccessResponse = (res, device, unblockedBy) => {
    return res.status(OK).json({
        success: true,
        message: "Device unblocked successfully.",
        data: {
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            userId: device.userId,
            isBlocked: device.isBlocked,
            unblockReason: device.unblockReason,
            unblockedBy: device.unblockedBy,
            unblockedAt: device.unblockedAt
        }
    });
};

const listDevicesSuccessResponse = (res, devices, totalCount, page, limit) => {
    return res.status(OK).json({
        success: true,
        message: "Devices retrieved successfully.",
        data: {
            devices,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            pageSize: devices.length
        }
    });
};

const viewDeviceDetailsSuccessResponse = (res, device) => {
    return res.status(OK).json({
        success: true,
        message: "Device details retrieved successfully.",
        data: device
    });
};

const deviceSuccessResponses = {
    blockDeviceSuccessResponse,
    unblockDeviceSuccessResponse,
    listDevicesSuccessResponse,
    viewDeviceDetailsSuccessResponse
};

module.exports = {
    deviceSuccessResponses
};
