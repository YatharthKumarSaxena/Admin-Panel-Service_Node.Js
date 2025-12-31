const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwNotFoundError, throwConflictError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType } = require("@configs/enums.config");
const { fetchAdmin } = require("@utils/fetch-admin.util");

/**
 * Update Admin Details Controller
 * Updates email/phone of an admin (excluding self)
 */
const updateAdminDetails = async (req, res) => {
  try {
    const actor = req.admin;
    const { adminId, email, fullPhoneNumber, supervisorId } = req.body;

    const targetAdmin = req.foundAdmin;
    
    if (!targetAdmin) {
      logWithTime(`❌ Admin not found for update ${getLogIdentifiers(req)}`);
      return throwNotFoundError(res, "Admin not found");
    }

    // Prevent updating own details through this endpoint
    if (targetAdmin.adminId === actor.adminId) {
      logWithTime(`❌ Admin ${actor.adminId} attempted to update own details via wrong endpoint ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Use UPDATE_OWN_ADMIN_DETAILS endpoint to update your own details");
    }

    // Check for duplicate email/phone
    if (email || fullPhoneNumber) {
      const existingAdmin = await fetchAdmin(email, fullPhoneNumber);
      if (existingAdmin && existingAdmin.adminId !== adminId) {
        logWithTime(`❌ Duplicate admin found during update ${getLogIdentifiers(req)}`);
        return throwConflictError(res, "Admin with provided email/phone already exists");
      }
    }

    // Update fields
    if (email) targetAdmin.email = email.trim().toLowerCase();
    if (fullPhoneNumber) targetAdmin.fullPhoneNumber = fullPhoneNumber.trim();
    if (supervisorId) targetAdmin.supervisorId = supervisorId;
    
    targetAdmin.updatedBy = actor.adminId;

    await targetAdmin.save();

    logWithTime(`✅ Admin ${adminId} (${targetAdmin.adminType}) updated by ${actor.adminId}`);

    // Determine event type
    const eventType = targetAdmin.adminType === AdminType.MID_ADMIN 
      ? ACTIVITY_TRACKER_EVENTS.UPDATE_MID_ADMIN_DETAILS 
      : ACTIVITY_TRACKER_EVENTS.UPDATE_ADMIN_DETAILS;

    // Log activity
    logActivityTrackerEvent(req, eventType, {
      description: `Admin ${adminId} (${targetAdmin.adminType}) details updated by ${actor.adminId}`,
      adminActions: {
        targetUserId: adminId,
        targetUserDetails: {
          email: targetAdmin.email,
          fullPhoneNumber: targetAdmin.fullPhoneNumber,
          adminType: targetAdmin.adminType
        },
        reason: req.body?.reason || "Administrative update"
      }
    });

    return res.status(OK).json({
      message: `${targetAdmin.adminType} details updated successfully`,
      adminId: adminId,
      updatedBy: actor.adminId
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in updating admin details ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { updateAdminDetails };
