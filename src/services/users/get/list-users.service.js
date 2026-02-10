// LIST USERS SERVICE

const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * List Users Service
 * @param {Object} filters - Filter parameters
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const listUsersService = async (filters) => {
    try {
        const {
            userId,
            isBlocked,
            blockReason,
            unblockReason,
            blockedBy,
            unblockedBy,
            email,
            fullPhoneNumber,
            search,
            createdFrom,
            createdTo,
            blockedFrom,
            blockedTo,
            unblockedFrom,
            unblockedTo,
            select,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = filters;

        const filter = {};

        // Basic Filters
        if (userId) filter.userId = userId;
        if (isBlocked !== undefined) filter.isBlocked = isBlocked;
        if (blockReason) filter.blockReason = blockReason;
        if (unblockReason) filter.unblockReason = unblockReason;
        if (blockedBy) filter.blockedBy = blockedBy;
        if (unblockedBy) filter.unblockedBy = unblockedBy;
        if (email) filter.email = email;
        if (fullPhoneNumber) filter.fullPhoneNumber = fullPhoneNumber;

        // Search Filter
        if (search) {
            filter.$or = [
                { userId: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { fullPhoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Date Filters
        if (createdFrom || createdTo) {
            filter.createdAt = {};
            if (createdFrom) filter.createdAt.$gte = new Date(createdFrom);
            if (createdTo) filter.createdAt.$lte = new Date(createdTo);
        }

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

        // Pagination
        const parsedLimit = Math.min(parseInt(limit) || 20, 100);
        const parsedPage = Math.max(parseInt(page) || 1, 1);
        const skip = (parsedPage - 1) * parsedLimit;

        // Sorting
        const sort = {
            [sortBy]: sortOrder === 'desc' ? -1 : 1
        };

        // Build query
        let query = UserModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parsedLimit);

        // Field Selection
        if (select) {
            query = query.select(select.split(',').join(' '));
        }

        // Execute query
        const [users, totalCount] = await Promise.all([
            query.lean(),
            UserModel.countDocuments(filter)
        ]);

        return {
            success: true,
            data: {
                users,
                totalCount,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(totalCount / parsedLimit)
            }
        };

    } catch (error) {
        logWithTime(`❌ List users service error: ${error.message}`);
        return {
            success: false,
            type: 'INVALID_DATA',
            message: error.message
        };
    }
};

module.exports = { listUsersService };
