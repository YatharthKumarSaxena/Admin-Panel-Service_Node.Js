const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");
const { makeRequestId } = require("@/services/common/request-id.service");
const { requestType, requestStatus } = require("@configs/enums.config");

/**
 * Service: Create Deactivation Request
 * Creates deactivation request for an active admin
 * 
 * @param {Object} actor - Admin creating the request
 * @param {Object} targetAdmin - Admin to be deactivated
 * @param {String} reason - Reason for deactivation
 * @param {String} notes - Additional notes
 * @param {Object} device - Device making the request
 * @param {String} requestIdIn - Internal request ID for tracking
 * @returns {Object} { success, data?, type?, message? }
 */
const createDeactivationRequestService = async (
    actor,
    targetAdmin,
    reason,
    notes,
    device,
    requestIdIn
) => {
    try {
        // Check for existing pending request
        const existingRequest = await AdminStatusRequestModel.findOne({
            targetAdminId: targetAdmin.adminId,
            requestType: requestType.DEACTIVATION,
            status: requestStatus.PENDING
        });

        if (existingRequest) {
            logWithTime(`⚠️ Admin ${targetAdmin.adminId} already has pending deactivation request`);
            return {
                success: false,
                type: 'PENDING_EXISTS',
                message: 'Target admin already has a pending deactivation request'
            };
        }

        // Generate request ID
        const requestId = await makeRequestId();
        if (!requestId || requestId === "") {
            logWithTime(`❌ Failed to generate requestId for admin ${actor.adminId}`);
            return {
                success: false,
                type: 'GENERATION_FAILED',
                message: 'Failed to generate request ID. Please try again later.'
            };
        }

        // Create deactivation request directly with atomic operation
        const deactivationRequest = await AdminStatusRequestModel.create({
            requestId,
            requestType: requestType.DEACTIVATION,
            requestedBy: actor.adminId,
            targetAdminId: targetAdmin.adminId,
            reason,
            notes: notes || null
        });

        logWithTime(`✅ Deactivation request created: ${requestId} by ${actor.adminId} for ${targetAdmin.adminId}`);

        // Activity tracking
        await logActivityTrackerEvent(
            {
                admin: actor,
                device,
                requestId: requestIdIn
            },
            ACTIVITY_TRACKER_EVENTS.CREATE_DEACTIVATION_REQUEST,
            {
                description: `Admin ${actor.adminId} requested deactivation for ${targetAdmin.adminId}. Request ID: ${requestId}`,
                adminActions: {
                    targetId: targetAdmin.adminId,
                    reason: reason
                }
            }
        );

        return {
            success: true,
            data: deactivationRequest
        };

    } catch (error) {
        logWithTime(`❌ Error in createDeactivationRequestService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to create deactivation request'
        };
    }
};

module.exports = {
    createDeactivationRequestService
};
