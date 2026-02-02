const { activateAdminWithRequestService } = require("@services/admins/update/activate-admin-with-request.service");
const { logWithTime } = require("@utils/time-stamps.util");
const { 
  throwBadRequestError, 
  throwInternalServerError, 
  getLogIdentifiers, 
  throwAccessDeniedError 
} = require("@/responses/common/error-handler.response");
const { activateAdminSuccessResponse } = require("@/responses/success/index");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * Activate Admin Controller (Direct Activation)
 * Allows SUPER_ADMIN to directly activate without request workflow
 */

const activateAdmin = async (req, res) => {
  try {
    const actor = req.admin;
    const { reason } = req.body;
    const targetAdmin = req.foundAdmin;

    // Call service (handles notifications)
    const result = await activateAdminWithRequestService(targetAdmin, actor, reason);

    // Handle service errors
    if (!result.success) {
      if (result.type === AdminErrorTypes.UNAUTHORIZED) {
        return throwAccessDeniedError(res, result.message);
      }
      if (result.type === AdminErrorTypes.ALREADY_ACTIVE) {
        return throwBadRequestError(res, result.message);
      }
      return throwInternalServerError(res, result.message);
    }

    // Success response
    return activateAdminSuccessResponse(res, result.data, actor);

  } catch (err) {
    logWithTime(`❌ Internal Error in activateAdmin controller ${getLogIdentifiers(req)}: ${err.message}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { activateAdmin };