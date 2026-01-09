const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwDBResourceNotFoundError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");
const { requestType, requestStatus } = require("@/configs/enums.config");
const { notifyActivationRequestApproved, notifyActivationApprovalConfirmation, notifyActivationApprovedToSupervisor, notifyRequesterActivationApproved } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Approve Activation Request Controller
 * Allows supervisor/super admin to approve activation request
 */

const approveActivationRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId } = req.params;
    const { reviewNotes } = req.body;

    // Find the request
    const request = await AdminStatusRequestModel.findOne({ requestId, requestType: requestType.ACTIVATION });

    if (!request) {
      logWithTime(`❌ Activation request not found: ${requestId} ${getLogIdentifiers(req)}`);
      return throwDBResourceNotFoundError(res, "Activation request");
    }

    // Check if already processed
    if (request.status !== requestStatus.PENDING) {
      logWithTime(`⚠️ Request ${requestId} already ${request.status} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, `Request has already been ${request.status.toLowerCase()}`);
    }

    // Prevent self-approval
    if (request.requestedBy === actor.adminId) {
      logWithTime(`❌ Admin ${actor.adminId} attempted to approve own request ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Cannot approve your own request");
    }

    // Find target admin
    const targetAdmin = await AdminModel.findOne({ adminId: request.targetAdminId });

    if (!targetAdmin) {
      logWithTime(`❌ Target admin not found: ${request.targetAdminId} ${getLogIdentifiers(req)}`);
      return throwDBResourceNotFoundError(res, "Target admin no longer exists");
    }

    // Clone entity before changes for audit
    const oldState = cloneForAudit(targetAdmin);

    // Activate the admin
    targetAdmin.isActive = true;
    targetAdmin.activatedBy = actor.adminId;
    targetAdmin.activatedReason = request.reason;
    targetAdmin.updatedBy = actor.adminId;

    // Update request status
    request.status = requestStatus.APPROVED;
    request.reviewedBy = actor.adminId;
    request.reviewedAt = new Date();
    request.reviewNotes = reviewNotes || null;

    // Save both
    await Promise.all([
      targetAdmin.save(),
      request.save()
    ]);

    // Prepare audit data
    const { oldData, newData } = prepareAuditData(oldState, targetAdmin);

    logWithTime(`✅ Activation request ${requestId} approved by ${actor.adminId}, admin ${targetAdmin.adminId} activated`);

    // Send notifications to all parties
    const requester = await fetchAdmin(null, null, request.requestedBy);
    if(requester) {
      await notifyRequesterActivationApproved(requester, targetAdmin, actor);
    }
    await notifyActivationRequestApproved(targetAdmin, actor);
    await notifyActivationApprovalConfirmation(actor, targetAdmin);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, targetAdmin.supervisorId);
    if(supervisor) {
      await notifyActivationApprovedToSupervisor(supervisor, targetAdmin, actor);
    }

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.APPROVE_ACTIVATION_REQUEST, {
      description: `Activation request ${requestId} approved by ${actor.adminId}`,
      oldData,
      newData,
      adminActions: {
        targetId: targetAdmin.adminId,
        reason: request.reason
      }
    });

    return res.status(OK).json({
      message: "Activation request approved and admin activated successfully",
      requestId: requestId,
      adminId: targetAdmin.adminId,
      approvedBy: actor.adminId
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in approving activation request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { approveActivationRequest };
