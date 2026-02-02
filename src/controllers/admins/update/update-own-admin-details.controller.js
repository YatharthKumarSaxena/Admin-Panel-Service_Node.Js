const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwConflictError } = require("@/responses/common/error-handler.response");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { notifyOwnDetailsUpdated } = require("@utils/admin-notifications.util");

/**
 * Update Own Admin Details Controller
 * Allows an admin to update their own email/phone
 */

const updateOwnAdminDetails = async (req, res) => {
  try {
    const admin = req.admin;
    const { email, fullPhoneNumber } = req.body;

    if (!email && !fullPhoneNumber) {
      logWithTime(`❌ No update fields provided ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "At least one field (email or phone) must be provided");
    }

    // Check for duplicate email/phone
    if (email || fullPhoneNumber) {
      const existingAdmin = await fetchAdmin(email, fullPhoneNumber);
      if (existingAdmin && existingAdmin.adminId !== admin.adminId) {
        logWithTime(`❌ Duplicate admin found during self-update ${getLogIdentifiers(req)}`);
        return throwConflictError(res, "Admin with provided email/phone already exists");
      }
    }

    // Update fields
    if (email) admin.email = email;
    if (fullPhoneNumber) admin.fullPhoneNumber = fullPhoneNumber;
    
    admin.updatedBy = admin.adminId;

    await admin.save();

    logWithTime(`✅ Admin ${admin.adminId} (${admin.adminType}) updated own details`);

    // Send notifications
    await notifyOwnDetailsUpdated(admin);

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.UPDATE_OWN_ADMIN_DETAILS, {
      description: `Admin ${admin.adminId} (${admin.adminType}) updated own details`
    });

    return res.status(OK).json({
      message: "Your details updated successfully",
      adminId: admin.adminId,
      updatedFields: {
        email: email ? true : false,
        fullPhoneNumber: fullPhoneNumber ? true : false
      }
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in updating own details ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { updateOwnAdminDetails };
