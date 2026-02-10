const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { viewOwnAdminDetailsSuccessResponse } = require("@/responses/success/admin.response");

/**
 * View Own Admin Details Controller
 * Allows admin to view their own complete profile
 */

const viewOwnAdminDetails = async (req, res) => {
  try {
    const admin = req.admin;

    logWithTime(`🔍 Admin ${admin.adminId} viewing own profile`);

    // Return complete profile information
    const adminProfile = {
      adminId: admin.adminId,
      email: admin.email || null,
      fullPhoneNumber: admin.fullPhoneNumber || null,
      adminType: admin.adminType,
      isActive: admin.isActive,
      supervisorId: admin.supervisorId || null,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      createdBy: admin.createdBy || null,
      updatedBy: admin.updatedBy || null,
      activatedBy: admin.activatedBy || null,
      activationReason: admin.activationReason || null,
      deactivatedBy: admin.deactivatedBy || null,
      deactivationReason: admin.deactivationReason || null
    };

    return viewOwnAdminDetailsSuccessResponse(res, adminProfile);

  } catch (err) {
    logWithTime(`❌ Error viewing own profile: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { viewOwnAdminDetails };
