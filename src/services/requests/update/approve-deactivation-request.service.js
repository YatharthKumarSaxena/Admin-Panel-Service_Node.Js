const { AdminModel } = require("@models/admin.model");
const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");
const { requestStatus } = require("@configs/enums.config");

/**
 * Service: Approve Deactivation Request
 * Approves deactivation request and deactivates the admin atomically
 * 
 * @param {Object} request - The deactivation request document
 * @param {Object} targetAdmin - Admin to be deactivated
 * @param {Object} actor - Admin approving the request
 * @param {String} reviewNotes - Notes for the approval
 * @param {Object} device - Device making the request
 * @param {String} requestIdIn - Internal request ID for tracking
 * @returns {Object} { success, data?, type?, message? }
 */
const approveDeactivationRequestService = async (
    request,
    targetAdmin,
    actor,
    reviewNotes,
    device,
    requestIdIn
) => {
    try {
        // Clone entity before changes for audit
        const oldState = cloneForAudit(targetAdmin);

        // Deactivate admin atomically
        const updatedAdmin = await AdminModel.findOneAndUpdate(
            { adminId: targetAdmin.adminId },
            {
                $set: {
                    isActive: false,
                    deactivatedBy: actor.adminId,
                    deactivatedReason: request.reason,
                    updatedBy: actor.adminId,
                    deactivatedAt: new Date()
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedAdmin) {
            return {
                success: false,
                type: 'UPDATE_FAILED',
                message: 'Failed to deactivate admin'
            };
        }

        // Update request status atomically
        const updatedRequest = await AdminStatusRequestModel.findOneAndUpdate(
            { requestId: request.requestId },
            {
                $set: {
                    status: requestStatus.APPROVED,
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

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldState, updatedAdmin);

        logWithTime(`✅ Deactivation request ${request.requestId} approved by ${actor.adminId}, admin ${targetAdmin.adminId} deactivated`);

        // Activity tracking
        await logActivityTrackerEvent(
            {
                admin: actor,
                device,
                requestId: requestIdIn
            },
            ACTIVITY_TRACKER_EVENTS.APPROVE_DEACTIVATION_REQUEST,
            {
                description: `Deactivation request ${request.requestId} approved by ${actor.adminId}`,
                oldData,
                newData,
                adminActions: {
                    targetId: targetAdmin.adminId,
                    reason: request.reason
                }
            }
        );

        return {
            success: true,
            data: {
                request: updatedRequest,
                admin: updatedAdmin
            }
        };

    } catch (error) {
        logWithTime(`❌ Error in approveDeactivationRequestService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to approve deactivation request'
        };
    }
};

module.exports = {
    approveDeactivationRequestService
};
