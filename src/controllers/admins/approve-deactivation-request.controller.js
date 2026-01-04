const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwDBResourceNotFoundError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");
const { requestType, requestStatus } = require("@/configs/enums.config");
const { notifyDeactivationRequestApproved, notifyDeactivationApprovedToSupervisor } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Approve Deactivation Request Controller
 * Allows supervisor/super admin to approve deactivation request
 */
const approveDeactivationRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId } = req.params;
    const { reviewNotes } = req.body;

    // Find the request
    const request = await AdminStatusRequestModel.findOne({ requestId, requestType: requestType.DEACTIVATION });

    if (!request) {
      logWithTime(`❌ Deactivation request not found: ${requestId} ${getLogIdentifiers(req)}`);
      return throwDBResourceNotFoundError(res, "Deactivation request with ID " + requestId);
    }

    // Prevent self-approval
    if (request.requestedBy === actor.adminId) {
      logWithTime(`❌ Admin ${actor.adminId} attempted to approve own request ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Cannot approve your own request");
    }

    // Check if already processed
    if (request.status !== requestStatus.PENDING) {
      logWithTime(`⚠️ Request ${requestId} already ${request.status} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, `Request has already been ${request.status.toLowerCase()}`);
    }

    // Find target admin
    const targetAdmin = await AdminModel.findOne({ adminId: request.targetAdminId });

    if (!targetAdmin) {
      logWithTime(`❌ Target admin not found: ${request.targetAdminId} ${getLogIdentifiers(req)}`);
      return throwDBResourceNotFoundError(res, "Target admin with ID " + request.targetAdminId + " no longer exists");
    }

    // Clone entity before changes for audit
    const oldState = cloneForAudit(targetAdmin);

    // Deactivate the admin
    targetAdmin.isActive = false;
    targetAdmin.deactivatedBy = actor.adminId;
    targetAdmin.deactivatedReason = request.reason;
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

    logWithTime(`✅ Deactivation request ${requestId} approved by ${actor.adminId}, admin ${targetAdmin.adminId} deactivated`);

    // Send notifications
    await notifyDeactivationRequestApproved(targetAdmin, actor);
    
    // Notify supervisor if different from actor and target
    const supervisor = await fetchAdmin(null, null, targetAdmin.supervisorId);
    if(supervisor && supervisor.adminId !== actor.adminId) {
      await notifyDeactivationApprovedToSupervisor(supervisor, targetAdmin, actor);
    }

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.APPROVE_DEACTIVATION_REQUEST, {
      description: `Deactivation request ${requestId} approved by ${actor.adminId}`,
      oldData,
      newData,
      adminActions: {
        targetUserId: targetAdmin.adminId,
        targetUserDetails: {
          email: targetAdmin.email,
          fullPhoneNumber: targetAdmin.fullPhoneNumber,
          adminType: targetAdmin.adminType
        },
        reason: request.reason
      }
    });

    return res.status(OK).json({
      message: "Deactivation request approved and admin deactivated successfully",
      requestId: requestId,
      adminId: targetAdmin.adminId,
      approvedBy: actor.adminId
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in approving deactivation request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { approveDeactivationRequest };
