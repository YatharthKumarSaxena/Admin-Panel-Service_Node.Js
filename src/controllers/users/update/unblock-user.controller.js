const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { unblockUserService } = require("@services/users/update/unblock-user.service");
const { unblockUserSuccessResponse } = require("@/responses/success/index");
const { UnblockReasons } = require("@configs/enums.config");
const { notifyUserUnblocked, notifyUserUnblockedToSupervisor } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Unblock User Controller
 * Unblocks a previously blocked user account
 */
const unblockUser = async (req, res) => {
  try {
    const admin = req.admin;
    const { reason, reasonDetails } = req.body;

    // Validate unblock reason
    if (!Object.values(UnblockReasons).includes(reason)) {
      logWithTime(`❌ Invalid unblock reason: ${reason} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Invalid unblock reason provided");
    }

    // Find user (assumed to be in req.foundUser by middleware)
    const user = req.foundUser;

    // Call service
    const result = await unblockUserService(
      user,
      admin,
      reason,
      reasonDetails,
      req.device,
      req.requestId
    );

    // Handle service errors
    if (!result.success) {
      if (result.type === 'NOT_BLOCKED') {
        return throwBadRequestError(res, result.message);
      }
      return throwInternalServerError(res, result.message);
    }

    // Send notifications
    await notifyUserUnblocked(result.data, admin, reason);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, admin.supervisorId);
    if(supervisor) {
      await notifyUserUnblockedToSupervisor(supervisor, result.data, admin, reason, reasonDetails);
    }

    // Success response
    return unblockUserSuccessResponse(res, result.data, admin);

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in unblocking user ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { unblockUser };
