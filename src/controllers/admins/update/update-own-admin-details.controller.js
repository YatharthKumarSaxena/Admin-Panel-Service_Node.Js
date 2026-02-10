const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwConflictError } = require("@/responses/common/error-handler.response");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { notifyOwnDetailsUpdated } = require("@utils/admin-notifications.util");
const { updateOwnAdminDetailsService } = require("@/services/admins/update/update-own-admin-details.service");
const { updateOwnAdminDetailsSuccessResponse } = require("@/responses/success/admin.response");

/**
 * Update Own Admin Details Controller
 * Allows an admin to update their own email/phone
 */

const updateOwnAdminDetails = async (req, res) => {
  try {
    const admin = req.admin;
    const { email, fullPhoneNumber } = req.body;
    const device = req.device;

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

    const updates = {};
    if (email) updates.firstName = email;
    if (fullPhoneNumber) updates.fullPhoneNumber = fullPhoneNumber;

    const result = await updateOwnAdminDetailsService(
      admin,
      updates,
      device,
      req.requestId
    );

    if (!result.success) {
      logWithTime(`❌ ${result.message} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, result.message);
    }

    logWithTime(`✅ Admin ${admin.adminId} updated own details`);

    // Send notifications
    await notifyOwnDetailsUpdated(result.data.admin);

    const updatedFields = {
      email: email ? true : false,
      fullPhoneNumber: fullPhoneNumber ? true : false
    };

    return updateOwnAdminDetailsSuccessResponse(res, result.data.admin, updatedFields);

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
