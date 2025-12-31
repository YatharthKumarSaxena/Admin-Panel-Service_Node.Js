const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers, throwNotFoundError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");

/**
 * View Admin Details Controller
 * Retrieves comprehensive details of an admin
 */
const viewAdminDetails = async (req, res) => {
  try {
    const actor = req.admin;
    const { adminId } = req.params;

    const targetAdmin = req.foundAdmin;
    
    if (!targetAdmin) {
      logWithTime(`❌ Admin not found ${getLogIdentifiers(req)}`);
      return throwNotFoundError(res, "Admin not found");
    }

    logWithTime(`🔍 Admin ${actor.adminId} viewing details of ${adminId}`);

    // Prepare sanitized admin details
    const adminDetails = {
      adminId: targetAdmin.adminId,
      email: targetAdmin.email || null,
      fullPhoneNumber: targetAdmin.fullPhoneNumber || null,
      adminType: targetAdmin.adminType,
      isActive: targetAdmin.isActive,
      supervisorId: targetAdmin.supervisorId || null,
      createdAt: targetAdmin.createdAt,
      updatedAt: targetAdmin.updatedAt,
      createdBy: targetAdmin.createdBy || null,
      updatedBy: targetAdmin.updatedBy || null,
      deactivatedAt: targetAdmin.deactivatedAt || null,
      deactivatedBy: targetAdmin.deactivatedBy || null,
      deactivationReason: targetAdmin.deactivationReason || null
    };

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.VIEW_ADMIN_DETAILS, {
      description: `Admin ${actor.adminId} viewed details of ${adminId}`,
      adminActions: {
        targetUserId: adminId,
        reason: req.body?.reason || "Administrative review"
      }
    });

    return res.status(OK).json({
      message: "Admin details retrieved successfully",
      data: adminDetails,
      viewedBy: actor.adminId
    });

  } catch (err) {
    logWithTime(`❌ Internal Error in viewing admin details ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { viewAdminDetails };
