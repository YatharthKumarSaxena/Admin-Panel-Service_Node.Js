const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { viewAdminDetailsSuccessResponse } = require("@/responses/success/admin.response");

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

    logWithTime(`✅ Admin ${actor.adminId} viewed details of ${targetAdmin.adminId}`);
  
    return viewAdminDetailsSuccessResponse(res, adminDetails);

  } catch (err) {
    logWithTime(`❌ Internal Error in viewing admin details ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { viewAdminDetails };
