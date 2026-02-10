const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { listDevicesService } = require("@services/devices/get/list-devices.service");
const { listDevicesSuccessResponse } = require("@/responses/success/index");

/**
 * LIST DEVICES
 * GET /admin/devices
 */
const listDevices = async (req, res, next) => {
    try {
        const admin = req.admin;
        const {
            deviceId,
            isBlocked,
            blockReason,
            unblockReason,
            blockedBy,
            unblockedBy,

            minBlockCount,
            maxBlockCount,
            minUnblockCount,
            maxUnblockCount,

            blockedFrom,
            blockedTo,
            unblockedFrom,
            unblockedTo,

            createdFrom,
            createdTo,

            select,        // fields selection
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            sortOrder = "desc"
        } = req.query;

        const filter = {};

        /* 🔍 Basic Filters */
        if (deviceId) filter.deviceId = deviceId;
        if (isBlocked !== undefined) filter.isBlocked = isBlocked === "true";
        if (blockReason) filter.blockReason = blockReason;
        if (unblockReason) filter.unblockReason = unblockReason;
        if (blockedBy) filter.blockedBy = blockedBy;
        if (unblockedBy) filter.unblockedBy = unblockedBy;

        /* 🔢 Count Filters */
        if (minBlockCount || maxBlockCount) {
            filter.blockCount = {};
            if (minBlockCount) filter.blockCount.$gte = Number(minBlockCount);
            if (maxBlockCount) filter.blockCount.$lte = Number(maxBlockCount);
        }

        if (minUnblockCount || maxUnblockCount) {
            filter.unblockCount = {};
            if (minUnblockCount) filter.unblockCount.$gte = Number(minUnblockCount);
            if (maxUnblockCount) filter.unblockCount.$lte = Number(maxUnblockCount);
        }

        /* ⏱ Date Filters */
        if (blockedFrom || blockedTo) {
            filter.blockedAt = {};
            if (blockedFrom) filter.blockedAt.$gte = new Date(blockedFrom);
            if (blockedTo) filter.blockedAt.$lte = new Date(blockedTo);
        }

        if (unblockedFrom || unblockedTo) {
            filter.unblockedAt = {};
            if (unblockedFrom) filter.unblockedAt.$gte = new Date(unblockedFrom);
            if (unblockedTo) filter.unblockedAt.$lte = new Date(unblockedTo);
        }

        if (createdFrom || createdTo) {
            filter.createdAt = {};
            if (createdFrom) filter.createdAt.$gte = new Date(createdFrom);
            if (createdTo) filter.createdAt.$lte = new Date(createdTo);
        }

        // Pagination, sorting, and select options
        const options = {
            select,
            page: Number(page),
            limit: Number(limit),
            sortBy,
            sortOrder
        };

        // Call service
        const result = await listDevicesService(
            filter,
            options,
            admin,
            req.device,
            req.requestId
        );

        // Handle service errors
        if (!result.success) {
            return throwInternalServerError(res, result.message);
        }

        return listDevicesSuccessResponse(res, result.data.devices, result.data.total, page, limit);

    } catch (error) {
        logWithTime(`❌ Error in listDevices controller ${getLogIdentifiers(req)}: ${error.message}`);
        return throwInternalServerError(res, error);
    }
};

module.exports = {
    listDevices
};
