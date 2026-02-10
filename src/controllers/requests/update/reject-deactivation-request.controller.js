const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { rejectDeactivationRequestService } = require("@/services/requests/update/reject-deactivation-request.service");
const { rejectDeactivationRequestSuccessResponse } = require("@/responses/success/request.response");

/**
 * Reject Deactivation Request Controller
 * Allows supervisor/super admin to reject deactivation request
 */

const rejectDeactivationRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId } = req.params;
    const { reviewNotes } = req.body;
    const device = req.device;

    const result = await rejectDeactivationRequestService(
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

    logWithTime(`✅ Deactivation request ${requestId} rejected by ${actor.adminId}`);
    return rejectDeactivationRequestSuccessResponse(res, result.data.request, actor);

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in rejecting deactivation request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { rejectDeactivationRequest };
