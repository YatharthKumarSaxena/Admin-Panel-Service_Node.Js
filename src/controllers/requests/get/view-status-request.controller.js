const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers, throwAccessDeniedError } = require("@/responses/common/error-handler.response");
const { viewStatusRequestService } = require("@/services/requests/get/view-status-request.service");
const { viewStatusRequestSuccessResponse } = require("@/responses/success/request.response");

/**
 * View Status Request Controller
 * Generic controller for viewing both activation and deactivation requests
 * Access control varies by request type
 */

const viewStatusRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId } = req.params;
    const device = req.device;

    const result = await viewStatusRequestService(
      requestId,
      actor,
      device,
      req.requestId
    );

    if (!result.success) {
      logWithTime(`❌ ${result.message} ${getLogIdentifiers(req)}`);
      if (result.type === 'NOT_FOUND') {
        const { throwDBResourceNotFoundError } = require("@/responses/common/error-handler.response");
        return throwDBResourceNotFoundError(res, result.message);
      }
      return throwAccessDeniedError(res, result.message);
    }

    logWithTime(`✅ Status request ${requestId} viewed by ${actor.adminId}`);
    return viewStatusRequestSuccessResponse(res, result.data);

  } catch (err) {
    logWithTime(`❌ Error viewing status request: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { viewStatusRequest };
