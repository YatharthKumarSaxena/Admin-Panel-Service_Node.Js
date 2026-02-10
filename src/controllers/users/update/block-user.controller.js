const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { blockUserService } = require("@services/users/update/block-user.service");
const { blockUserSuccessResponse } = require("@/responses/success/index");
const { BlockReasons } = require("@configs/enums.config");
const { notifyUserBlocked, notifyUserBlockedToSupervisor } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Block User Controller
 * Blocks a user account with a specified reason
 */

const blockUser = async (req, res) => {
  try {
    const admin = req.admin;
    const { reason, reasonDetails } = req.body;

    // Validate block reason
    if (!Object.values(BlockReasons).includes(reason)) {
      logWithTime(`❌ Invalid block reason: ${reason} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Invalid block reason provided");
    }

    // Find user (assumed to be in req.foundUser by middleware)
    const user = req.foundUser;

    // Call service
    const result = await blockUserService(
      user,
      admin,
      reason,
      reasonDetails,
      req.device,
      req.requestId
    );

    // Handle service errors
    if (!result.success) {
      if (result.type === 'ALREADY_BLOCKED') {
        return throwBadRequestError(res, result.message);
      }
      return throwInternalServerError(res, result.message);
    }

    // Send notifications
    await notifyUserBlocked(result.data, admin, reason, reasonDetails);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, admin.supervisorId);
    if(supervisor) {
      await notifyUserBlockedToSupervisor(supervisor, result.data, admin, reason, reasonDetails);
    }

    // Success response
    return blockUserSuccessResponse(res, result.data, admin);

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in blocking user ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { blockUser };
