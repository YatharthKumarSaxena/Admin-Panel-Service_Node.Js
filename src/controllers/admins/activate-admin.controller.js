const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType } = require("@configs/enums.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Activate Admin Controller
 * Activates a deactivated admin account
 */

const activateAdmin = async (req, res) => {
  try {
    const actor = req.admin;
    const { reason, notes } = req.body;

    const targetAdmin = req.foundAdmin;
    
    if (!targetAdmin) {
      logWithTime(`❌ Admin not found for activation ${getLogIdentifiers(req)}`);
      return throwNotFoundError(res, "Admin not found");
    }

    // Check if already active
    if (targetAdmin.isActive) {
      logWithTime(`⚠️ Admin ${targetAdmin.adminId} is already active ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Admin is already active");
    }

    // Clone entity before changes for audit
    const oldState = cloneForAudit(targetAdmin);

    // Activate the admin
    targetAdmin.isActive = true;
    targetAdmin.activatedAt = new Date();
    targetAdmin.activatedBy = actor.adminId;
    targetAdmin.activationReason = reason;
    targetAdmin.activationNotes = notes || null;
    targetAdmin.updatedBy = actor.adminId;

    await targetAdmin.save();

    // Prepare audit data (ENV decides full or changed only)
    const { oldData, newData, changedFields } = prepareAuditData(oldState, targetAdmin);

    logWithTime(`✅ Admin ${targetAdmin.adminId} (${targetAdmin.adminType}) activated by ${actor.adminId}`);

    // Determine event type
    const eventType = targetAdmin.adminType === AdminType.MID_ADMIN 
      ? ACTIVITY_TRACKER_EVENTS.ACTIVATE_MID_ADMIN 
      : ACTIVITY_TRACKER_EVENTS.ACTIVATE_ADMIN;

    // Log activity with audit data
    logActivityTrackerEvent(req, eventType, {
      description: `Admin ${targetAdmin.adminId} (${targetAdmin.adminType}) activated by ${actor.adminId}`,
      oldData,
      newData,
      changedFields,
      adminActions: {
        targetUserId: targetAdmin.adminId,
        targetUserDetails: {
          email: targetAdmin.email,
          fullPhoneNumber: targetAdmin.fullPhoneNumber,
          adminType: targetAdmin.adminType
        },
        reason: reason,
        notes: notes || null
      }
    });

    return res.status(OK).json({
      message: `${targetAdmin.adminType} activated successfully`,
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
