// VIEW OWN ADMIN DETAILS SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { AdminErrorTypes } = require("@configs/enums.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");

/**
 * View Own Admin Details Service
 * @param {string} adminId - The admin ID to fetch
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const viewOwnAdminDetailsService = async (adminId) => {
    try {
        const admin = await AdminModel.findOne({ adminId })
            .select('-__v')
            .lean();

        if (!admin) {
            return {
                success: false,
                type: AdminErrorTypes.NOT_FOUND,
                message: "Admin not found"
            };
        }

        // Log activity tracker event
        logActivityTrackerEvent(
            admin,
            ACTIVITY_TRACKER_EVENTS.VIEW_OWN_ADMIN_DETAILS,
            `Viewed own admin details`,
            { viewedOwnDetails: true }
        );

        logWithTime(`✅ Admin ${adminId} viewed own details`);

        return {
            success: true,
            data: admin
        };

    } catch (error) {
        logWithTime(`❌ View own admin details service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { viewOwnAdminDetailsService };
