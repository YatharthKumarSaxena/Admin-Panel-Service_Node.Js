const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");

/**
 * View Admin Details Controller
 * Retrieves comprehensive details of an admin
 */

const viewAdminDetails = async (req, res) => {
  try {
    const actor = req.admin;
    const { reason } = req.params;

    const targetAdmin = req.foundAdmin;

    logWithTime(`🔍 Admin ${actor.adminId} viewing details of ${targetAdmin.adminId}`);

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
      activatedBy: targetAdmin.activatedBy || null,
      activatedReason: targetAdmin.activatedReason || null,
      deactivatedBy: targetAdmin.deactivatedBy || null,
      deactivatedReason: targetAdmin.deactivatedReason || null
    };

    // Log activity - only when viewing OTHER admins (not self)
    // Industry standard: Self-views are not audit-worthy
    if (actor.adminId !== targetAdmin.adminId) {
      logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.VIEW_ADMIN_DETAILS, {
        description: `Admin ${actor.adminId} viewed details of ${targetAdmin.adminId}`,
        adminActions: {
          targetAdminId: targetAdmin.adminId,
          reason: reason
        }
      });
    }

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
