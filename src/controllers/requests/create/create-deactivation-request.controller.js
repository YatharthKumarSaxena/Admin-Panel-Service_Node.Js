const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwConflictError } = require("@/responses/common/error-handler.response");
const { createDeactivationRequestService } = require("@services/requests/create/create-deactivation-request.service");
const { createDeactivationRequestSuccessResponse } = require("@/responses/success/index");
const { notifyDeactivationRequestSubmitted, notifyDeactivationRequestReview } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Create Deactivation Request Controller
 * Allows admin to request deactivation of their own account
 */

const createDeactivationRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { reason, notes } = req.body;

    // Check if admin is already inactive
    if (!actor.isActive) {
      logWithTime(`⚠️ Admin ${actor.adminId} is already inactive ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Your account is already inactive");
    }

    // Call service
    const result = await createDeactivationRequestService(
      actor,
      actor, // targetAdmin is also actor for deactivation
      reason,
      notes,
      req.device,
      req.requestId
    );

    // Handle service errors
    if (!result.success) {
      if (result.type === 'PENDING_EXISTS') {
        return throwConflictError(res, result.message);
      }
      if (result.type === 'GENERATION_FAILED') {
        return throwInternalServerError(res, result.message);
      }
      return throwInternalServerError(res, result.message);
    }

    // Send notifications
    await notifyDeactivationRequestSubmitted(actor, result.data.requestId);
    
    // Notify supervisor if different from self
    const supervisor = await fetchAdmin(null, null, actor.supervisorId);
    if(supervisor) {
      await notifyDeactivationRequestReview(supervisor, actor, result.data.requestId);
    }

    // Success response
    return createDeactivationRequestSuccessResponse(res, result.data);

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in creating deactivation request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { createDeactivationRequest };
