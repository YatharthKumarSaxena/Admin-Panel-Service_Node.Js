// UPDATE ADMIN DETAILS SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * Update Admin Details Service
 * @param {Object} targetAdmin - The admin to update
 * @param {Object} updaterAdmin - The admin performing the update
 * @param {Object} updates - Fields to update {firstName, etc.}
 * @param {string} updateReason - Reason for update
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const updateAdminDetailsService = async (targetAdmin, updaterAdmin, updates, updateReason) => {
    try {
        const allowedUpdates = ['firstName'];
        const updateFields = {};
        const updatedFieldNames = [];

        // Build update object
        for (const [key, value] of Object.entries(updates)) {
            if (allowedUpdates.includes(key) && value !== undefined) {
                updateFields[key] = value;
                updatedFieldNames.push(key);
            }
        }

        if (updatedFieldNames.length === 0) {
            return {
                success: false,
                type: AdminErrorTypes.INVALID_DATA,
                message: "No valid fields to update"
            };
        }

        // Add metadata
        updateFields.updatedBy = updaterAdmin.adminId;

        // Atomic update
        const updatedAdmin = await AdminModel.findOneAndUpdate(
            { _id: targetAdmin._id },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
            return {
                success: false,
                type: AdminErrorTypes.NOT_FOUND,
                message: "Admin not found"
            };
        }

        logWithTime(`✅ Admin details updated in DB: ${updatedAdmin.adminId}`);

        // Log activity
        logActivityTrackerEvent(
            updaterAdmin,
            ACTIVITY_TRACKER_EVENTS.ADMIN_UPDATED,
            `Updated admin ${updatedAdmin.adminId} details`,
            { 
                targetAdminId: updatedAdmin.adminId, 
                updatedFields: updatedFieldNames,
                reason: updateReason 
            }
        );

        return {
            success: true,
            data: {
                admin: updatedAdmin,
                updatedFields: updatedFieldNames
            }
        };

    } catch (error) {
        logWithTime(`❌ Update admin details service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { updateAdminDetailsService };
