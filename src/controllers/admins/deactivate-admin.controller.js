const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwNotFoundError, throwAccessDeniedError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType } = require("@configs/enums.config");

/**
 * Deactivate Admin Controller
 * Deactivates an active admin account
 */
const deactivateAdmin = async (req, res) => {
  try {
    const actor = req.admin;
    const { adminId, reason, reasonDetails } = req.body;

    const targetAdmin = req.foundAdmin;
    
    if (!targetAdmin) {
      logWithTime(`❌ Admin not found for deactivation ${getLogIdentifiers(req)}`);
      return throwNotFoundError(res, "Admin not found");
    }

    // Prevent self-deactivation
    if (targetAdmin.adminId === actor.adminId) {
      logWithTime(`❌ Admin ${actor.adminId} attempted self-deactivation ${getLogIdentifiers(req)}`);
      return throwAccessDeniedError(res, "Cannot deactivate your own account");
    }

    // Check if already inactive
    if (!targetAdmin.isActive) {
      logWithTime(`⚠️ Admin ${adminId} is already inactive ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Admin is already inactive");
    }

    // Deactivate the admin
    targetAdmin.isActive = false;
    targetAdmin.deactivatedAt = new Date();
    targetAdmin.deactivatedBy = actor.adminId;
    targetAdmin.deactivationReason = reason || null;
    targetAdmin.deactivationReasonDetails = reasonDetails || null;
    targetAdmin.updatedBy = actor.adminId;

    await targetAdmin.save();

    logWithTime(`✅ Admin ${adminId} (${targetAdmin.adminType}) deactivated by ${actor.adminId}`);

    // Determine event type
    const eventType = targetAdmin.adminType === AdminType.MID_ADMIN 
      ? ACTIVITY_TRACKER_EVENTS.DEACTIVATE_MID_ADMIN 
      : ACTIVITY_TRACKER_EVENTS.DEACTIVATE_ADMIN;

    // Log activity
    logActivityTrackerEvent(req, eventType, {
      description: `Admin ${adminId} (${targetAdmin.adminType}) deactivated by ${actor.adminId}`,
      adminActions: {
        targetUserId: adminId,
        targetUserDetails: {
          email: targetAdmin.email,
          fullPhoneNumber: targetAdmin.fullPhoneNumber,
          adminType: targetAdmin.adminType
        },
        reason: reason || "Admin account deactivation",
        reasonDetails: reasonDetails || "No additional details"
      }
    });

    return res.status(OK).json({
      message: `${targetAdmin.adminType} deactivated successfully`,
      adminId: adminId,
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
