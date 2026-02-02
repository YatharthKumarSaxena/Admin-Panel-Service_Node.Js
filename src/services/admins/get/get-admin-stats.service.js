// GET ADMIN STATS SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * Get Admin Dashboard Stats Service
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const getAdminStatsService = async () => {
    try {
        const [
            totalAdmins,
            activeAdmins,
            inactiveAdmins,
            adminsByType
        ] = await Promise.all([
            AdminModel.countDocuments(),
            AdminModel.countDocuments({ isActive: true }),
            AdminModel.countDocuments({ isActive: false }),
            AdminModel.aggregate([
                {
                    $group: {
                        _id: "$adminType",
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const stats = {
            total: totalAdmins,
            active: activeAdmins,
            inactive: inactiveAdmins,
            byType: adminsByType.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        };

        return {
            success: true,
            data: stats
        };

    } catch (error) {
        logWithTime(`❌ Get admin stats service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { getAdminStatsService };
