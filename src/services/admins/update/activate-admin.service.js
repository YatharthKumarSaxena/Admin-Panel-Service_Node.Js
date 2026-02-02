// ACTIVATE ADMIN SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * Activate Admin Service
 * @param {Object} targetAdmin - The admin to activate
 * @param {Object} activatorAdmin - The admin performing activation
 * @param {string} activationReason - Reason for activation
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const activateAdminService = async (targetAdmin, activatorAdmin, activationReason) => {
    try {
        // Check if already active
        if (targetAdmin.isActive === true) {
            return {
                success: false,
                type: AdminErrorTypes.ALREADY_ACTIVE,
                message: "Admin is already active"
            };
        }

        // Atomic activation using findOneAndUpdate
        const updatedAdmin = await AdminModel.findOneAndUpdate(
            { _id: targetAdmin._id, isActive: false },
            {
                $set: {
                    isActive: true,
                    activatedBy: activatorAdmin.adminId,
                    activatedReason: activationReason,
                    updatedBy: activatorAdmin.adminId
                }
            },
            { new: true }
        );

        if (!updatedAdmin) {
            return {
                success: false,
                type: AdminErrorTypes.ALREADY_ACTIVE,
                message: "Admin already activated by another process"
            };
        }

        logWithTime(`✅ Admin activated in DB: ${updatedAdmin.adminId}`);

        // Log activity
        logActivityTrackerEvent(
            activatorAdmin,
            ACTIVITY_TRACKER_EVENTS.ADMIN_ACTIVATED,
            `Activated admin ${updatedAdmin.adminId}`,
            { targetAdminId: updatedAdmin.adminId, reason: activationReason }
        );

        return {
            success: true,
            data: updatedAdmin
        };

    } catch (error) {
        logWithTime(`❌ Activate admin service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { activateAdminService };
