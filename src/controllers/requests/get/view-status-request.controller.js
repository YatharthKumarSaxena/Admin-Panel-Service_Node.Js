const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers, throwDBResourceNotFoundError, throwAccessDeniedError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { AdminType } = require("@configs/enums.config");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");

/**
 * View Status Request Controller
 * Generic controller for viewing both activation and deactivation requests
 * Access control varies by request type
 */

const viewStatusRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId } = req.params;

    const request = await AdminStatusRequestModel.findOne({ requestId }).lean();

    if (!request) {
      logWithTime(`❌ Status request ${requestId} not found`);
      return throwDBResourceNotFoundError(res, "Status request");
    }

    // ✅ Hierarchical access control based on request type
    if (actor.adminType === AdminType.SUPER_ADMIN) {
      // Super Admin: Can view any request
    } else if (actor.adminType === AdminType.MID_ADMIN) {
      // Mid Admin: Can only view requests for regular ADMINs
      const targetAdmin = await AdminModel.findOne(
        { adminId: request.targetAdminId },
        { adminType: 1 }
      ).lean();

      if (!targetAdmin || targetAdmin.adminType !== AdminType.ADMIN) {
        logWithTime(`🚫 MID_ADMIN ${actor.adminId} attempted to view request ${requestId} for non-ADMIN target`);
        return throwAccessDeniedError(res, "Access denied: Cannot view requests for this admin type");
      }
    } else {
      // Regular ADMIN: Different access based on request type
      if (request.requestedBy !== actor.adminId) {
        logWithTime(`🚫 Regular ADMIN ${actor.adminId} attempted to view activation request ${requestId}`);
        return throwAccessDeniedError(res, "Access denied: Regular admins cannot view other admin requests");
      } 
    }

    // Fetch additional details (requester and target admin info)
    const [requesterAdmin, targetAdmin] = await Promise.all([
      AdminModel.findOne({ adminId: request.requestedBy }, { adminId: 1, email: 1, adminType: 1 }).lean(),
      AdminModel.findOne({ adminId: request.targetAdminId }, { adminId: 1, email: 1, adminType: 1, isActive: 1 }).lean()
    ]);

    // Fetch reviewer info if request is reviewed
    let reviewerAdmin = null;
    if (request.reviewedBy) {
      reviewerAdmin = await AdminModel.findOne(
        { adminId: request.reviewedBy },
        { adminId: 1, email: 1, adminType: 1 }
      ).lean();
    }

    // Prepare detailed response
    const requestDetails = {
      requestId: request.requestId,
      requestType: request.requestType,
      status: request.status,
      reason: request.reason,
      notes: request.notes || null,
      reviewNotes: request.reviewNotes || null,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      reviewedAt: request.reviewedAt || null,
      requestedBy: {
        adminId: request.requestedBy,
        email: requesterAdmin?.email || "Unknown",
        adminType: requesterAdmin?.adminType || "Unknown"
      },
      targetAdmin: {
        adminId: request.targetAdminId,
        email: targetAdmin?.email || "Unknown",
        adminType: targetAdmin?.adminType || "Unknown",
        isActive: targetAdmin?.isActive ?? null
      },
      reviewedBy: request.reviewedBy ? {
        adminId: request.reviewedBy,
        email: reviewerAdmin?.email || "Unknown",
        adminType: reviewerAdmin?.adminType || "Unknown"
      } : null
    };

    // Log activity tracking - only if viewing another admin's request
    if (request.targetAdminId !== actor.adminId) {
      const eventType = ACTIVITY_TRACKER_EVENTS.VIEW_ADMIN_REQUEST;

      logActivityTrackerEvent(req, eventType, {
        description: `Admin ${actor.adminId} viewed ${request.requestType.toLowerCase()} request ${requestId}`,
        adminActions: {
          targetAdminId: request.targetAdminId
        }
      });
    }

    logWithTime(`✅ ${request.requestType} request ${requestId} viewed by ${actor.adminId} (${actor.adminType})`);

    return res.status(OK).json({
      message: "Status request details retrieved successfully",
      data: requestDetails,
      viewedBy: actor.adminId
    });

  } catch (err) {
    logWithTime(`❌ Error viewing status request: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { viewStatusRequest };
