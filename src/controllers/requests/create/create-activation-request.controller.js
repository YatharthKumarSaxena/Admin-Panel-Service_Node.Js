const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwConflictError } = require("@/responses/common/error-handler.response");
const { CREATED } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { makeRequestId } = require("@services/request-id.service");
const { requestType, requestStatus } = require("@configs/enums.config");
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

    // Check for existing pending request
    const existingRequest = await AdminStatusRequestModel.findOne({
      targetAdminId: targetAdminId,
      requestType: requestType.ACTIVATION,
      status: requestStatus.PENDING
    });

    if (existingRequest) {
      logWithTime(`⚠️ Admin ${targetAdminId} already has pending activation request ${getLogIdentifiers(req)}`);
      return throwConflictError(res, "Target admin already has a pending activation request");
    }

    // Generate request ID
    const requestId = await makeRequestId();
    if (requestId === "") {
      logWithTime(`❌ Failed to generate requestId for admin ${actor.adminId} ${getLogIdentifiers(req)}`);
      return throwInternalServerError(res, "Failed to generate request ID. Please try again later.");
    }

    // Create activation request
    const activationRequest = new AdminStatusRequestModel({
      requestId,
      requestType: requestType.ACTIVATION,
      requestedBy: actor.adminId, // Active admin
      targetAdminId: targetAdminId, // Deactivated admin
      reason,
      notes: notes
    });

    await activationRequest.save();

    logWithTime(`✅ Activation request created: ${requestId} by ${actor.adminId} for ${targetAdminId}`);

    // Send notifications to all parties
    await notifyActivationRequestSubmitted(actor, targetAdmin, requestId);
    await notifyActivationRequestPending(targetAdmin, actor, requestId);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, targetAdmin.supervisorId);
    if(supervisor) {
      await notifyActivationRequestReview(supervisor, targetAdmin, actor, requestId);
    }

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.CREATE_ACTIVATION_REQUEST, {
      description: `Admin ${actor.adminId} requested activation for ${targetAdminId}. Request ID: ${requestId}`,
      adminActions: {
        targetId: targetAdminId,
        reason: reason
      }
    });

    return res.status(CREATED).json({
      message: "Activation request created successfully",
      requestId: requestId,
      targetAdminId: targetAdminId,
      status: requestStatus.PENDING,
      note: "Request is pending approval from supervisor/super admin"
    });

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