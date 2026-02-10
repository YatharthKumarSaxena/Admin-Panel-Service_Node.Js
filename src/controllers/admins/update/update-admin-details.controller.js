const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwConflictError } = require("@/responses/common/error-handler.response");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { notifyDetailsUpdated, notifyDetailsUpdateConfirmation, notifyDetailsUpdateToSupervisor } = require("@utils/admin-notifications.util");
const { updateAdminDetailsService } = require("@/services/admins/update/update-admin-details.service");
const { updateAdminDetailsSuccessResponse } = require("@/responses/success/admin.response");

/**
 * Update Admin Details Controller
 * Updates email/phone of an admin (excluding self)
 */

// Only Super Admins for Emergency Changes

const updateAdminDetails = async (req, res) => {
  try {
    const actor = req.admin;
    const { email, fullPhoneNumber, reason } = req.body;
    const targetAdmin = req.foundAdmin;
    const device = req.device;

    // Check for duplicate email/phone
    if (email || fullPhoneNumber) {
      const existingAdmin = await fetchAdmin(email, fullPhoneNumber);
      if (existingAdmin && existingAdmin.adminId !== targetAdmin.adminId) {
        logWithTime(`❌ Duplicate admin found during update ${getLogIdentifiers(req)}`);
        return throwConflictError(res, "Admin with provided email/phone already exists");
      }
    } else {
      logWithTime(`❌ No update fields provided ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "At least one field (email or phone) must be provided");
    }

    const updates = {};
    if (email) updates.firstName = email.trim().toLowerCase();
    if (fullPhoneNumber) updates.fullPhoneNumber = fullPhoneNumber.trim();

    const result = await updateAdminDetailsService(
      targetAdmin,
      actor,
      updates,
      reason,
      device,
      req.requestId
    );

    if (!result.success) {
      logWithTime(`❌ ${result.message} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, result.message);
    }

    logWithTime(`✅ Admin ${targetAdmin.adminId} details updated by ${actor.adminId}`);

    // Send notifications
    await notifyDetailsUpdated(result.data.admin, actor);
    await notifyDetailsUpdateConfirmation(actor, result.data.admin);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, result.data.admin.supervisorId);
    if (supervisor) {
      await notifyDetailsUpdateToSupervisor(supervisor, result.data.admin, actor);
    }

    const updatedFields = {};
    if (email) updatedFields.email = true;
    if (fullPhoneNumber) updatedFields.fullPhoneNumber = true;

    return updateAdminDetailsSuccessResponse(res, result.data.admin, updatedFields);
      message: `${targetAdmin.adminType} details updated successfully`,
      adminId: targetAdmin.adminId,
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
