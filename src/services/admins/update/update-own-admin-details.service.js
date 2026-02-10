// UPDATE OWN ADMIN DETAILS SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes } = require("@configs/enums.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Update Own Admin Details Service
 * @param {Object} admin - The admin updating their own details (from req.admin with .lean())
 * @param {Object} updates - Fields to update {firstName, etc.}
 * @param {Object} device - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const updateOwnAdminDetailsService = async (admin, updates, device, requestId) => {
    try {
        const allowedUpdates = ['firstName'];
        const updateFields = {};
        const updatedFieldNames = [];

        // Clone for audit before changes
        const oldAdminData = cloneForAudit(admin);

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
        updateFields.updatedBy = admin.adminId;

        // Atomic update - MUST use findOneAndUpdate because admin is .lean()
        const updatedAdmin = await AdminModel.findOneAndUpdate(
            { _id: admin._id },
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

        logWithTime(`✅ Admin updated own details in DB: ${updatedAdmin.adminId}`);

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldAdminData, updatedAdmin);

        // Log activity
        logActivityTrackerEvent(
            admin,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.UPDATE_OWN_DETAILS,
            `Updated own details: ${updatedFieldNames.join(', ')}`,
            { 
                oldData,
                newData
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
        logWithTime(`❌ Update own admin details service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { updateOwnAdminDetailsService };
