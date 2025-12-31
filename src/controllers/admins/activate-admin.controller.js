const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwNotFoundError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType } = require("@configs/enums.config");

/**
 * Activate Admin Controller
 * Activates a deactivated admin account
 */

const activateAdmin = async (req, res) => {
  try {
    const actor = req.admin;
    const { adminId, reason } = req.body;

    const targetAdmin = req.foundAdmin;
    
    if (!targetAdmin) {
      logWithTime(`❌ Admin not found for activation ${getLogIdentifiers(req)}`);
      return throwNotFoundError(res, "Admin not found");
    }

    // Check if already active
    if (targetAdmin.isActive) {
      logWithTime(`⚠️ Admin ${adminId} is already active ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Admin is already active");
    }

    // Activate the admin
    targetAdmin.isActive = true;
    targetAdmin.activatedAt = new Date();
    targetAdmin.activatedBy = actor.adminId;
    targetAdmin.updatedBy = actor.adminId;

    await targetAdmin.save();

    logWithTime(`✅ Admin ${adminId} (${targetAdmin.adminType}) activated by ${actor.adminId}`);

    // Determine event type
    const eventType = targetAdmin.adminType === AdminType.MID_ADMIN 
      ? ACTIVITY_TRACKER_EVENTS.ACTIVATE_MID_ADMIN 
      : ACTIVITY_TRACKER_EVENTS.ACTIVATE_ADMIN;

    // Log activity
    logActivityTrackerEvent(req, eventType, {
      description: `Admin ${adminId} (${targetAdmin.adminType}) activated by ${actor.adminId}`,
      adminActions: {
        targetUserId: adminId,
        targetUserDetails: {
          email: targetAdmin.email,
          fullPhoneNumber: targetAdmin.fullPhoneNumber,
          adminType: targetAdmin.adminType
        },
        reason: reason || "Admin account reactivation"
      }
    });

    return res.status(OK).json({
      message: `${targetAdmin.adminType} activated successfully`,
      adminId: adminId,
      activatedBy: actor.adminId
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
