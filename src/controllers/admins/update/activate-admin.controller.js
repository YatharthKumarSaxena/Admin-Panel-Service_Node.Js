const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwAccessDeniedError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType, requestStatus, requestType } = require("@configs/enums.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");
const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { notifyAdminActivated, notifyActivationConfirmation, notifyActivationToSupervisor } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Activate Admin Controller (Direct Activation)
 * Allows SUPER_ADMIN to directly activate without request workflow
 */

const activateAdmin = async (req, res) => {
  try {
    const actor = req.admin;
    const { reason } = req.body;

    const targetAdmin = req.foundAdmin;

    // Super Admin cannot be activated or deactivated by others
    if(targetAdmin.adminType === AdminType.SUPER_ADMIN){
      logWithTime(`❌ Super Admin ${targetAdmin.adminId} activation attempt by ${actor.adminId} ${getLogIdentifiers(req)}`);
      return throwAccessDeniedError(res, "Cannot activate or deactivate a Super Admin");
    }

    // Check if already active
    if (targetAdmin.isActive) {
      logWithTime(`⚠️ Admin ${targetAdmin.adminId} is already active ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Admin is already active");
    }

    // Clone entity before changes for audit
    const oldState = cloneForAudit(targetAdmin);

    // ✅ Auto-approve any activation requests
    const existingRequest = await AdminStatusRequestModel.findOne(
      {
        targetAdminId: targetAdmin.adminId,
        requestType: { $in: [requestType.ACTIVATION, requestType.DEACTIVATION] },
        status: requestStatus.PENDING
      }
    );

    if(existingRequest){
      if (existingRequest.requestType === requestType.ACTIVATION) {
        existingRequest.status = requestStatus.APPROVED;
      }
      else if (existingRequest.requestType === requestType.DEACTIVATION) {
        existingRequest.status = requestStatus.REJECTED;
      }

      existingRequest.reviewedBy = actor.adminId;
      existingRequest.reviewedAt = new Date();
      existingRequest.reviewNotes = `Auto-processed: Admin directly activated by Super Admin ${actor.adminId}`;

      await existingRequest.save();
    }

    // Activate the admin
    targetAdmin.isActive = true;
    targetAdmin.activatedBy = actor.adminId;
    targetAdmin.activatedReason = reason;
    targetAdmin.updatedBy = actor.adminId;

    await targetAdmin.save();

    // Prepare audit data
    const { oldData, newData } = prepareAuditData(oldState, targetAdmin);

    logWithTime(`✅ Admin ${targetAdmin.adminId} (${targetAdmin.adminType}) directly activated by Super Admin ${actor.adminId}`);

    // Send notifications
    await notifyAdminActivated(targetAdmin, actor);
    await notifyActivationConfirmation(actor, targetAdmin);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, targetAdmin.supervisorId);
    if(supervisor) {
      await notifyActivationToSupervisor(supervisor, targetAdmin, actor);
    }

    // Determine event type
    const eventType = targetAdmin.adminType === AdminType.MID_ADMIN 
      ? ACTIVITY_TRACKER_EVENTS.ACTIVATE_MID_ADMIN 
      : ACTIVITY_TRACKER_EVENTS.ACTIVATE_ADMIN;

    // Log activity with audit data
    logActivityTrackerEvent(req, eventType, {
      description: `Admin ${targetAdmin.adminId} directly activated by Super Admin ${actor.adminId}.`,
      oldData,
      newData,
      adminActions: {
        targetId: targetAdmin.adminId,
        reason: reason
      }
    });

    return res.status(OK).json({
      message: `${targetAdmin.adminType} activated successfully (Direct activation)`,
      adminId: targetAdmin.adminId,
      activatedBy: actor.adminId,
      reason: reason
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in activating admin ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { activateAdmin };