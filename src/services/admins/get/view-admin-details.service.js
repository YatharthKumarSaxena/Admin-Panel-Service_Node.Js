// VIEW ADMIN DETAILS SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { AdminErrorTypes } = require("@configs/enums.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");

/**
 * View Admin Details Service
 * @param {string} adminId - The admin ID to fetch
 * @param {Object} viewer - The admin viewing the details
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const viewAdminDetailsService = async (adminId, viewer) => {
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
            viewer,
            ACTIVITY_TRACKER_EVENTS.VIEW_ADMIN_DETAILS,
            `Viewed details of admin ${adminId}`,
            { viewedAdminId: adminId, viewedAdminType: admin.adminType }
        );

        logWithTime(`✅ Admin ${viewer.adminId} viewed details of admin ${adminId}`);

        return {
            success: true,
            data: admin
        };

    } catch (error) {
        logWithTime(`❌ View admin details service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { viewAdminDetailsService };
