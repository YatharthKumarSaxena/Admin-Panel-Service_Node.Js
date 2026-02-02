// CREATE ADMIN SERVICE

const { AdminModel } = require("@models/admin.model");
const { makeAdminId } = require("@services/user-id.service");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes } = require("@configs/enums.config");
const { notifySupervisorOnAdminCreation } = require("@utils/admin-notifications.util");

/**
 * Create Admin Service
 * @param {Object} creatorAdmin - The admin creating the new admin
 * @param {Object} adminData - Admin data {firstName, adminType, supervisorId, creationReason}
 * @param {Object} supervisor - Supervisor admin object (if applicable)
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const createAdminService = async (creatorAdmin, adminData, supervisor) => {
    try {
        const { firstName, adminType, supervisorId, creationReason } = adminData;

        // Generate admin ID
        const adminId = await makeAdminId();
        if (!adminId) {
            return {
                success: false,
                type: AdminErrorTypes.INVALID_DATA,
                message: "Failed to generate admin ID"
            };
        }

        // Create new admin
        const newAdmin = new AdminModel({
            adminId,
            firstName,
            adminType,
            supervisorId: supervisorId || null,
            createdBy: creatorAdmin.adminId,
            isActive: true
        });

        await newAdmin.save();

        logWithTime(`✅ Admin created in DB: ${newAdmin.adminId}`);

        // Log activity
        logActivityTrackerEvent(
            creatorAdmin,
            ACTIVITY_TRACKER_EVENTS.ADMIN_CREATED,
            `Created admin ${newAdmin.adminId} (${adminType})`,
            { targetAdminId: newAdmin.adminId, adminType, creationReason }
        );

        // Notify supervisor if applicable
        if (supervisor) {
            await notifySupervisorOnAdminCreation(supervisor, newAdmin, creatorAdmin);
        }

        return {
            success: true,
            data: newAdmin
        };

    } catch (error) {
        logWithTime(`❌ Create admin service error: ${error.message}`);
        
        if (error.code === 11000) {
            return {
                success: false,
                type: AdminErrorTypes.CONFLICT,
                message: "Admin ID already exists"
            };
        }

        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { createAdminService };
