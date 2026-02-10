const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { provideUserAccountDetailsSuccessResponse } = require("@/responses/success/internal.response");

/**
 * Provide User Account Details Controller
 * Returns comprehensive user account information
 */

const provideUserAccountDetails = async (req, res) => {
  try {
    const admin = req.admin;
    const { reason } = req.params;

    const user = req.foundUser;

    const userId = user.userId;

    logWithTime(`🔍 Admin ${admin.adminId} accessing account details for user ${userId}`);

    // Prepare sanitized user details (exclude sensitive fields if needed)
    const userDetails = {
      userId: user.userId,
      email: user.email || null,
      fullPhoneNumber: user.fullPhoneNumber || null,
      isActive: user.isActive,
      isBlocked: user.isBlocked || false,
      blockReason: user.blockReason || null,
      blockReasonDetails: user.blockReasonDetails || null,
      blockedAt: user.blockedAt || null,
      blockedBy: user.blockedBy || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdBy: user.createdBy || null
    };

    logWithTime(`✅ Admin ${admin.adminId} accessed account details for user ${userId}`);

    return provideUserAccountDetailsSuccessResponse(res, userDetails);

  } catch (err) {
    logWithTime(`❌ Internal Error in providing user details ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { provideUserAccountDetails };
