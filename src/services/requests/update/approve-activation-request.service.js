const { AdminModel } = require("@models/admin.model");
const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");
const { requestStatus } = require("@configs/enums.config");

/**
 * Service: Approve Activation Request
 * Approves activation request and activates the admin atomically
 * 
 * @param {String} requestId - The activation request ID
 * @param {Object} actor - Admin approving the request
 * @param {String} reviewNotes - Notes for the approval
 * @param {Object} device - Device making the request
 * @param {String} requestIdIn - Internal request ID for tracking
 * @returns {Object} { success, data?, type?, message? }
 */
const approveActivationRequestService = async (
    requestId,
    actor,
    reviewNotes,
    device,
    requestIdIn
) => {
    try {
        const { requestType, requestStatus } = require("@configs/enums.config");

        // Fetch request first
        const request = await AdminStatusRequestModel.findOne({ 
            requestId, 
            requestType: requestType.ACTIVATION 
        }).lean();

        if (!request) {
            return {
                success: false,
                type: 'NOT_FOUND',
                message: 'Activation request not found'
            };
        }

        // Check if already processed
        if (request.status !== requestStatus.PENDING) {
            return {
                success: false,
                type: 'ALREADY_PROCESSED',
                message: `Request has already been ${request.status.toLowerCase()}`
            };
        }

        // Prevent self-approval
        if (request.requestedBy === actor.adminId) {
            return {
                success: false,
                type: 'SELF_APPROVAL',
                message: 'Cannot approve your own request'
            };
        }

        // Find target admin
        const targetAdmin = await AdminModel.findOne({ adminId: request.targetAdminId }).lean();

        if (!targetAdmin) {
            return {
                success: false,
                type: 'NOT_FOUND',
                message: 'Target admin no longer exists'
            };
        }

        // Clone entity before changes for audit
        const oldState = cloneForAudit(targetAdmin);

        // Activate admin atomically
        const updatedAdmin = await AdminModel.findOneAndUpdate(
            { adminId: targetAdmin.adminId },
            {
                $set: {
                    isActive: true,
                    activatedBy: actor.adminId,
                    activatedReason: request.reason,
                    updatedBy: actor.adminId,
                    activatedAt: new Date()
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
                message: 'Failed to activate admin'
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

        logWithTime(`✅ Activation request ${request.requestId} approved by ${actor.adminId}, admin ${targetAdmin.adminId} activated`);

        // Activity tracking
        await logActivityTrackerEvent(
            {
                admin: actor,
                device,
                requestId: requestIdIn
            },
            ACTIVITY_TRACKER_EVENTS.APPROVE_ACTIVATION_REQUEST,
            {
                description: `Activation request ${request.requestId} approved by ${actor.adminId}`,
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
        logWithTime(`❌ Error in approveActivationRequestService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to approve activation request'
        };
    }
};

module.exports = {
    approveActivationRequestService
};
