const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { approveDeactivationRequestService } = require("@/services/requests/update/approve-deactivation-request.service");
const { approveDeactivationRequestSuccessResponse } = require("@/responses/success/request.response");

/**
 * Approve Deactivation Request Controller
 * Allows supervisor/super admin to approve deactivation request
 */
const approveDeactivationRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId } = req.params;
    const { reviewNotes } = req.body;
    const device = req.device;

    const result = await approveDeactivationRequestService(
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

    logWithTime(`✅ Deactivation request ${requestId} approved by ${actor.adminId}`);
    return approveDeactivationRequestSuccessResponse(res, result.data.request, actor);

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in approving deactivation request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { approveDeactivationRequest };
