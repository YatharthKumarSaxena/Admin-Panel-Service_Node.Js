// GET USER STATS SERVICE

const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * Get User Stats Service
 * @param {Object} filters - Optional filters {includeBlocked, startDate, endDate}
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const getUserStatsService = async (filters = {}) => {
    try {
        const { includeBlocked = false, startDate, endDate } = filters;

        // Build query
        const query = {};

        // Filter by blocked status if needed
        if (!includeBlocked) {
            query.isBlocked = { $ne: true };
        }

        // Filter by date range if provided
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Get counts
        const [totalUsers, blockedUsers] = await Promise.all([
            UserModel.countDocuments(query),
            UserModel.countDocuments({ isBlocked: true })
        ]);

        const stats = {
            totalRegistered: totalUsers,
            blockedUsers: blockedUsers,
            unblockedUsers: totalUsers - blockedUsers,
            filters: {
                includeBlocked: includeBlocked === true || includeBlocked === 'true',
                startDate: startDate || null,
                endDate: endDate || null
            }
        };

        logWithTime(`✅ User stats retrieved: ${totalUsers} users`);

        return {
            success: true,
            data: stats
        };

    } catch (error) {
        logWithTime(`❌ Get user stats service error: ${error.message}`);
        return {
            success: false,
            type: 'ERROR',
            message: error.message
        };
    }
};

module.exports = { getUserStatsService };
