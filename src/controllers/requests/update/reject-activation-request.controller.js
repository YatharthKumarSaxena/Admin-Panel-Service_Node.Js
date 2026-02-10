const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { rejectActivationRequestService } = require("@/services/requests/update/reject-activation-request.service");
const { rejectActivationRequestSuccessResponse } = require("@/responses/success/request.response");

/**
 * Reject Activation Request Controller
 * Allows supervisor/super admin to reject activation request
 */

const rejectActivationRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId } = req.params;
    const { reviewNotes } = req.body;
    const device = req.device;

    const result = await rejectActivationRequestService(
      requestId,
      actor,
      { reviewNotes },
      device,
      req.requestId
    );

    if (!result.success) {
      logWithTime(`❌ ${result.message} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, result.message);
    }

    logWithTime(`✅ Activation request ${requestId} rejected by ${actor.adminId}`);
    return rejectActivationRequestSuccessResponse(res, result.data.request, actor);

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in rejecting activation request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { rejectActivationRequest };
