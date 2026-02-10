const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { approveActivationRequestService } = require("@services/requests/update/approve-activation-request.service");
const { approveActivationRequestSuccessResponse } = require("@/responses/success/index");
const { notifyActivationRequestApproved, notifyActivationApprovalConfirmation, notifyActivationApprovedToSupervisor, notifyRequesterActivationApproved } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Approve Activation Request Controller
 * Allows supervisor/super admin to approve activation request
 */

const approveActivationRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId } = req.params;
    const { reviewNotes } = req.body;
    const device = req.device;

    // Call service (service will fetch request and targetAdmin)
    const result = await approveActivationRequestService(
      requestId,
      actor,
      reviewNotes,
      device,
      req.requestId
    );

    // Handle service errors
    if (!result.success) {
      logWithTime(`❌ ${result.message} ${getLogIdentifiers(req)}`);
      if (result.type === 'NOT_FOUND') {
        const { throwDBResourceNotFoundError } = require("@/responses/common/error-handler.response");
        return throwDBResourceNotFoundError(res, result.message);
      }
      if (result.type === 'ALREADY_PROCESSED' || result.type === 'SELF_APPROVAL') {
        return throwBadRequestError(res, result.message);
      }
      return throwInternalServerError(res, result.message);
    }

    // Send notifications to all parties
    const requester = await fetchAdmin(null, null, result.data.request.requestedBy);
    if (requester) {
      await notifyRequesterActivationApproved(requester, result.data.admin, actor);
    }
    await notifyActivationRequestApproved(result.data.admin, actor);
    await notifyActivationApprovalConfirmation(actor, result.data.admin);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, result.data.admin.supervisorId);
    if (supervisor) {
      await notifyActivationApprovedToSupervisor(supervisor, result.data.admin, actor);
    }

    logWithTime(`✅ Activation request ${requestId} approved by ${actor.adminId}`);

    // Success response
    return approveActivationRequestSuccessResponse(res, result.data.request, actor);

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in approving activation request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { approveActivationRequest };
