const { deactivateAdminWithRequestService } = require("@services/admins/delete/deactivate-admin-with-request.service");
const { logWithTime } = require("@utils/time-stamps.util");
const { 
  throwBadRequestError, 
  throwInternalServerError, 
  getLogIdentifiers, 
  throwAccessDeniedError 
} = require("@/responses/common/error-handler.response");
const { deactivateAdminSuccessResponse } = require("@/responses/success/index");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * Deactivate Admin Controller (Direct Deactivation)
 * Allows SUPER_ADMIN to directly deactivate without request workflow
 */

const deactivateAdmin = async (req, res) => {
  try {
    const actor = req.admin;
    const { reason } = req.body;
    const targetAdmin = req.foundAdmin;

    // Call service (handles notifications)
    const result = await deactivateAdminWithRequestService(
      targetAdmin, 
      actor, 
      reason,
      req.device,
      req.requestId
    );

    // Handle service errors
    if (!result.success) {
      if (result.type === AdminErrorTypes.UNAUTHORIZED) {
        return throwAccessDeniedError(res, result.message);
      }
      if (result.type === AdminErrorTypes.ALREADY_INACTIVE) {
        return throwBadRequestError(res, result.message);
      }
      return throwInternalServerError(res, result.message);
    }

    // Success response
    return deactivateAdminSuccessResponse(res, result.data, actor);

  } catch (err) {
    logWithTime(`❌ Internal Error in deactivateAdmin controller ${getLogIdentifiers(req)}: ${err.message}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { deactivateAdmin };