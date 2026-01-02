const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwConflictError } = require("@utils/error-handler.util");
const { CREATED } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { makeRequestId } = require("@services/request-id.service");
const { requestType, requestStatus } = require("@configs/enums.config");

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

    // Check for existing pending request
    const existingRequest = await AdminStatusRequestModel.findOne({
      targetAdminId: actor.adminId,
      requestType: requestType.DEACTIVATION,
      status: requestStatus.PENDING
    });

    if (existingRequest) {
      logWithTime(`⚠️ Admin ${actor.adminId} already has pending deactivation request ${getLogIdentifiers(req)}`);
      return throwConflictError(res, "You already have a pending deactivation request");
    }

    // Generate request ID
    const requestId = await makeRequestId();
    if (requestId === "") {
      logWithTime(`❌ Failed to generate requestId for admin ${actor.adminId} ${getLogIdentifiers(req)}`);
      return throwInternalServerError(res, "Failed to generate request ID. Please try again later.");
    }

    // Create deactivation request
    const deactivationRequest = new AdminStatusRequestModel({
      requestId,
      requestType: requestType.DEACTIVATION,
      requestedBy: actor.adminId,
      targetAdminId: actor.adminId,
      reason,
      notes: notes || null
    });

    await deactivationRequest.save();

    logWithTime(`✅ Deactivation request created: ${requestId} by ${actor.adminId}`);

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.CREATE_DEACTIVATION_REQUEST, {
      description: `Admin ${actor.adminId} requested account deactivation`,
      adminActions: {
        targetUserId: actor.adminId,
        reason: reason
      }
    });

    return res.status(CREATED).json({
      message: "Deactivation request created successfully",
      requestId: requestId,
      status: "PENDING",
      note: "Your request is pending approval from supervisor/super admin"
    });

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
