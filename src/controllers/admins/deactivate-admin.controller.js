const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwAccessDeniedError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType, requestStatus, requestType } = require("@configs/enums.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");
const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { notifyAdminDeactivated, notifyDeactivationConfirmation, notifyDeactivationToSupervisor } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Deactivate Admin Controller (Direct Deactivation)
 * Allows SUPER_ADMIN to directly deactivate without request workflow
 */

const deactivateAdmin = async (req, res) => {
  try {
    const actor = req.admin;
    const { reason } = req.body;

    const targetAdmin = req.foundAdmin;

    // Super Admin cannot be deactivated
    if (targetAdmin.adminType === AdminType.SUPER_ADMIN) {
      logWithTime(`❌ Super Admin ${targetAdmin.adminId} deactivation attempt by ${actor.adminId} ${getLogIdentifiers(req)}`);
      return throwAccessDeniedError(res, "Cannot activate or deactivate a Super Admin");
    }

    // Check if already inactive
    if (!targetAdmin.isActive) {
      logWithTime(`⚠️ Admin ${targetAdmin.adminId} is already inactive ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Admin is already inactive");
    }

    // Clone entity before changes for audit
    const oldState = cloneForAudit(targetAdmin);

    // ✅ Handle existing requests (PENDING or REJECTED)
    const existingRequest = await AdminStatusRequestModel.findOne({
      targetAdminId: targetAdmin.adminId,
      status: requestStatus.PENDING,
      requestType: { $in: [requestType.DEACTIVATION, requestType.ACTIVATION] }
    });

    if (existingRequest) {
      if (existingRequest.requestType === requestType.DEACTIVATION) {
        // Auto-approve existing deactivation request
        existingRequest.status = requestStatus.APPROVED;
      }
      else if (existingRequest.requestType === requestType.ACTIVATION) {
        existingRequest.status = requestStatus.REJECTED;
      }

      existingRequest.reviewedBy = actor.adminId;
      existingRequest.reviewedAt = new Date();
      existingRequest.reviewNotes = `Auto-processed: Admin directly deactivated by Super Admin ${actor.adminId}`;

      await existingRequest.save();
    }
    // Deactivate the admin
    targetAdmin.isActive = false;
    targetAdmin.deactivatedBy = actor.adminId;
    targetAdmin.deactivatedReason = reason;
    targetAdmin.updatedBy = actor.adminId;

    await targetAdmin.save();

    // Prepare audit data
    const { oldData, newData } = prepareAuditData(oldState, targetAdmin);

    logWithTime(`✅ Admin ${targetAdmin.adminId} (${targetAdmin.adminType}) directly deactivated by Super Admin ${actor.adminId}`);

    // Send notifications
    await notifyAdminDeactivated(targetAdmin, actor, reason);
    await notifyDeactivationConfirmation(actor, targetAdmin);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, targetAdmin.supervisorId);
    if(supervisor) {
      await notifyDeactivationToSupervisor(supervisor, targetAdmin, actor);
    }

    // Determine event type
    const eventType = targetAdmin.adminType === AdminType.MID_ADMIN
      ? ACTIVITY_TRACKER_EVENTS.DEACTIVATE_MID_ADMIN
      : ACTIVITY_TRACKER_EVENTS.DEACTIVATE_ADMIN;

    // Log activity with audit data
    logActivityTrackerEvent(req, eventType, {
      description: `Admin ${targetAdmin.adminId} directly deactivated by Super Admin ${actor.adminId}`,
      oldData,
      newData,
      adminActions: {
        targetUserId: targetAdmin.adminId,
        targetUserDetails: {
          email: targetAdmin.email,
          fullPhoneNumber: targetAdmin.fullPhoneNumber,
          adminType: targetAdmin.adminType
        },
        reason: reason
      }
    });

    return res.status(OK).json({
      message: `${targetAdmin.adminType} deactivated successfully`,
      adminId: targetAdmin.adminId,
      deactivatedBy: actor.adminId,
      reason: reason
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in deactivating admin ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { deactivateAdmin };