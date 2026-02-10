const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");
const { requestStatus } = require("@configs/enums.config");

/**
 * Service: Reject Deactivation Request
 * Rejects deactivation request atomically
 * 
 * @param {Object} request - The deactivation request document
 * @param {Object} actor - Admin rejecting the request
 * @param {String} reviewNotes - Notes for the rejection
 * @param {Object} device - Device making the request
 * @param {String} requestIdIn - Internal request ID for tracking
 * @returns {Object} { success, data?, type?, message? }
 */
const rejectDeactivationRequestService = async (
    request,
    actor,
    reviewNotes,
    device,
    requestIdIn
) => {
    try {
        // Update request status atomically
        const updatedRequest = await AdminStatusRequestModel.findOneAndUpdate(
            { requestId: request.requestId },
            {
                $set: {
                    status: requestStatus.REJECTED,
                    reviewedBy: actor.adminId,
                    reviewedAt: new Date(),
                    reviewNotes: reviewNotes || null
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedRequest) {
            return {
                success: false,
                type: 'UPDATE_FAILED',
                message: 'Failed to reject deactivation request'
            };
        }

        logWithTime(`✅ Deactivation request ${request.requestId} rejected by ${actor.adminId}`);

        // Activity tracking
        await logActivityTrackerEvent(
            {
                admin: actor,
                device,
                requestId: requestIdIn
            },
            ACTIVITY_TRACKER_EVENTS.REJECT_DEACTIVATION_REQUEST,
            {
                description: `Deactivation request ${request.requestId} rejected by ${actor.adminId}`,
                adminActions: {
                    targetId: request.targetAdminId,
                    reason: reviewNotes || request.reason
                }
            }
        );

        return {
            success: true,
            data: updatedRequest
        };

    } catch (error) {
        logWithTime(`❌ Error in rejectDeactivationRequestService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to reject deactivation request'
        };
    }
};

module.exports = {
    rejectDeactivationRequestService
};
