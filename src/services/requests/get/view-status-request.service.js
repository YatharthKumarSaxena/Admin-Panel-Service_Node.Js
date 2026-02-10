const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");

/**
 * Service: View Status Request
 * Retrieves details of a specific status request
 * 
 * @param {Object} request - The status request document
 * @param {Object} actor - Admin viewing the request
 * @param {String} reason - Reason for viewing
 * @param {Object} device - Device making the request
 * @param {String} requestIdIn - Internal request ID for tracking
 * @returns {Object} { success, data?, type?, message? }
 */
const viewStatusRequestService = async (
    request,
    actor,
    reason,
    device,
    requestIdIn
) => {
    try {
        logWithTime(`🔍 Admin ${actor.adminId} viewing status request ${request.requestId}`);

        // Prepare sanitized request details
        const requestDetails = {
            requestId: request.requestId,
            requestType: request.requestType,
            requestedBy: request.requestedBy,
            targetAdminId: request.targetAdminId,
            status: request.status,
            reason: request.reason,
            notes: request.notes,
            reviewedBy: request.reviewedBy || null,
            reviewedAt: request.reviewedAt || null,
            reviewNotes: request.reviewNotes || null,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt
        };

        // Activity tracking
        await logActivityTrackerEvent(
            {
                admin: actor,
                device,
                requestId: requestIdIn
            },
            ACTIVITY_TRACKER_EVENTS.VIEW_STATUS_REQUEST,
            {
                description: `Admin ${actor.adminId} viewed status request ${request.requestId}`,
                adminActions: {
                    targetId: request.requestId,
                    reason: reason || 'View request details'
                }
            }
        );

        return {
            success: true,
            data: requestDetails
        };

    } catch (error) {
        logWithTime(`❌ Error in viewStatusRequestService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to retrieve status request'
        };
    }
};

module.exports = {
    viewStatusRequestService
};
