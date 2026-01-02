const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { requestType } = require("@/configs/enums.config");

/**
 * Reject Activation Request Controller
 * Allows supervisor/super admin to reject activation request
 */

const rejectActivationRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId } = req.params;
    const { reviewNotes } = req.body;

    // Find the request
    const request = await AdminStatusRequestModel.findOne({ requestId, requestType: requestType.ACTIVATION });

    if (!request) {
      logWithTime(`❌ Activation request not found: ${requestId} ${getLogIdentifiers(req)}`);
      return throwDBResourceNotFoundError(res, "Activation request with ID " + requestId);
    }

    // Prevent self-rejection
    if (request.requestedBy === actor.adminId) {
      logWithTime(`❌ Admin ${actor.adminId} attempted to reject own request ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Cannot reject your own request");
    }

    // Check if already processed
    if (request.status !== requestStatus.PENDING) {
      logWithTime(`⚠️ Request ${requestId} already ${request.status} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, `Request has already been ${request.status.toLowerCase()}`);
    }

    // Update request status
    request.status = requestStatus.REJECTED;
    request.reviewedBy = actor.adminId;
    request.reviewedAt = new Date();
    request.reviewNotes = reviewNotes || "Request rejected by reviewer";

    await request.save();

    logWithTime(`✅ Activation request ${requestId} rejected by ${actor.adminId}`);

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.REJECT_ACTIVATION_REQUEST, {
      description: `Activation request ${requestId} rejected by ${actor.adminId}`,
      adminActions: {
        targetUserId: request.targetAdminId,
        reason: request.reason
      }
    });

    return res.status(OK).json({
      message: "Activation request rejected successfully",
      requestId: requestId,
      rejectedBy: actor.adminId
    });

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
