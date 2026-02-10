// LIST DEVICES SERVICE

const { DeviceModel } = require("@models/device.model");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * List Devices Service
 * @param {Object} filters - Filter parameters
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const listDevicesService = async (filters) => {
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
            select,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = filters;

        const filter = {};

        // Basic Filters
        if (deviceId) filter.deviceId = deviceId;
        if (isBlocked !== undefined) filter.isBlocked = isBlocked;
        if (blockReason) filter.blockReason = blockReason;
        if (unblockReason) filter.unblockReason = unblockReason;
        if (blockedBy) filter.blockedBy = blockedBy;
        if (unblockedBy) filter.unblockedBy = unblockedBy;

        // Count Filters
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

        // Date Filters
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

        // Pagination
        const parsedLimit = Math.min(parseInt(limit) || 20, 100);
        const parsedPage = Math.max(parseInt(page) || 1, 1);
        const skip = (parsedPage - 1) * parsedLimit;

        // Sorting
        const sort = {
            [sortBy]: sortOrder === 'desc' ? -1 : 1
        };

        // Build query
        let query = DeviceModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parsedLimit);

        // Field Selection
        if (select) {
            query = query.select(select.split(',').join(' '));
        }

        // Execute query
        const [devices, totalCount] = await Promise.all([
            query.lean(),
            DeviceModel.countDocuments(filter)
        ]);

        return {
            success: true,
            data: {
                devices,
                totalCount,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(totalCount / parsedLimit)
            }
        };

    } catch (error) {
        logWithTime(`❌ List devices service error: ${error.message}`);
        return {
            success: false,
            type: 'INVALID_DATA',
            message: error.message
        };
    }
};

module.exports = { listDevicesService };
