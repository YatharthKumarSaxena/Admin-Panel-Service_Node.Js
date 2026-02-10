const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwConflictError } = require("@/responses/common/error-handler.response");
const { createActivationRequestService } = require("@services/requests/create/create-activation-request.service");
const { createActivationRequestSuccessResponse } = require("@/responses/success/index");
const { notifyActivationRequestSubmitted, notifyActivationRequestPending, notifyActivationRequestReview } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Create Activation Request Controller
 * Allows active admin to request activation of a deactivated admin
 */

const createActivationRequest = async (req, res) => {
  try {
    const actor = req.admin; 
    const { reason, notes } = req.body;

    const targetAdmin = req.foundAdmin;

    const targetAdminId = targetAdmin.adminId;

    // Prevent self-request (actor should be active)
    if (targetAdminId === actor.adminId) {
      logWithTime(`⚠️ Admin ${actor.adminId} attempted self-activation request ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Cannot request activation for your own account as Your Account is Active");
    }

    // Check if target admin is already active
    if (targetAdmin.isActive) {
      logWithTime(`⚠️ Admin ${targetAdminId} is already active ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Target admin is already active");
    }

    // Call service
    const result = await createActivationRequestService(
      actor,
      targetAdmin,
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

    // Send notifications to all parties
    await notifyActivationRequestSubmitted(actor, targetAdmin, result.data.requestId);
    await notifyActivationRequestPending(targetAdmin, actor, result.data.requestId);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, targetAdmin.supervisorId);
    if(supervisor) {
      await notifyActivationRequestReview(supervisor, targetAdmin, actor, result.data.requestId);
    }

    // Success response
    return createActivationRequestSuccessResponse(res, result.data);

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in creating activation request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { createActivationRequest };