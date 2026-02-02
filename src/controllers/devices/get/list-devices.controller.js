const { DeviceModel } = require("@models/device.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError } = require("@/responses/common/error-handler.response");
const { listDevicesSuccessResponse } = require("@/responses/success/index");

/**
 * LIST DEVICES
 * GET /admin/devices
 */
const listDevices = async (req, res, next) => {
    try {
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

        /* 📌 Pagination */
        const skip = (Number(page) - 1) * Number(limit);

        /* ↕ Sorting */
        const sort = {
            [sortBy]: sortOrder === "asc" ? 1 : -1
        };

        /* 📦 Query */
        const query = DeviceModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        /* 🎯 Field Selection */
        if (select) {
            // select=deviceId,isBlocked,blockCount
            query.select(select.split(",").join(" "));
        }

        const [devices, total] = await Promise.all([
            query.exec(),
            DeviceModel.countDocuments(filter)
        ]);

        return listDevicesSuccessResponse(res, devices, total, page, limit);

    } catch (error) {
        logWithTime(`❌ Error in listDevices controller: ${error.message}`);
        return throwInternalServerError(res, error);
    }
};

module.exports = {
    listDevices
};
