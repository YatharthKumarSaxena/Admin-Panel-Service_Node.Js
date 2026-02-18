const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");
const { makeRequestId } = require("@/services/common/request-id.service");
const { requestType, requestStatus } = require("@configs/enums.config");

/**
 * Service: Create Activation Request
 * Creates activation request for a deactivated admin
 * 
 * @param {Object} actor - Admin creating the request
 * @param {Object} targetAdmin - Admin to be activated
 * @param {String} reason - Reason for activation
 * @param {String} notes - Additional notes
 * @param {Object} device - Device making the request
 * @param {String} requestIdIn - Internal request ID for tracking
 * @returns {Object} { success, data?, type?, message? }
 */
const createActivationRequestService = async (
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
            requestType: requestType.ACTIVATION,
            status: requestStatus.PENDING
        });

        if (existingRequest) {
            logWithTime(`⚠️ Admin ${targetAdmin.adminId} already has pending activation request`);
            return {
                success: false,
                type: 'PENDING_EXISTS',
                message: 'Target admin already has a pending activation request'
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

        // Create activation request directly with atomic operation
        const activationRequest = await AdminStatusRequestModel.create({
            requestId,
            requestType: requestType.ACTIVATION,
            requestedBy: actor.adminId,
            targetAdminId: targetAdmin.adminId,
            reason,
            notes: notes || null
        });

        logWithTime(`✅ Activation request created: ${requestId} by ${actor.adminId} for ${targetAdmin.adminId}`);

        // Activity tracking
        await logActivityTrackerEvent(
            {
                admin: actor,
                device,
                requestId: requestIdIn
            },
            ACTIVITY_TRACKER_EVENTS.CREATE_ACTIVATION_REQUEST,
            {
                description: `Admin ${actor.adminId} requested activation for ${targetAdmin.adminId}. Request ID: ${requestId}`,
                adminActions: {
                    targetId: targetAdmin.adminId,
                    reason: reason
                }
            }
        );

        return {
            success: true,
            data: activationRequest
        };

    } catch (error) {
        logWithTime(`❌ Error in createActivationRequestService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to create activation request'
        };
    }
};

module.exports = {
    createActivationRequestService
};
