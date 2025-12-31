const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwNotFoundError, throwAccessDeniedError } = require("@utils/error-handler.util");
const { OK, CREATED } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType } = require("@configs/enums.config");

/**
 * Submit Role Change Request Controller
 * Submits a request to change an admin's role (pending approval)
 * 
 * NOTE: This requires a RoleChangeRequest model/collection to track requests
 */
const submitRoleChangeRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { targetAdminId, newRole, justification } = req.body;

    // Validate new role
    if (!Object.values(AdminType).includes(newRole)) {
      logWithTime(`❌ Invalid role provided: ${newRole} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Invalid role specified");
    }

    const targetAdmin = req.foundAdmin;
    
    if (!targetAdmin) {
      logWithTime(`❌ Target admin not found ${getLogIdentifiers(req)}`);
      return throwNotFoundError(res, "Target admin not found");
    }

    // Check if role is same
    if (targetAdmin.adminType === newRole) {
      logWithTime(`⚠️ Role change requested to same role ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Target admin already has this role");
    }

    // TODO: Create role change request in database
    // const roleChangeRequest = await RoleChangeRequestModel.create({
    //   requestedBy: actor.adminId,
    //   targetAdminId: targetAdminId,
    //   currentRole: targetAdmin.adminType,
    //   requestedRole: newRole,
    //   justification: justification,
    //   status: 'PENDING',
    //   createdAt: new Date()
    // });

    logWithTime(`✅ Role change request submitted: ${targetAdminId} (${targetAdmin.adminType} -> ${newRole})`);

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.ROLE_CHANGE_REQUEST_SUBMITTED, {
      description: `Role change request submitted for ${targetAdminId}: ${targetAdmin.adminType} -> ${newRole}`,
      adminActions: {
        targetUserId: targetAdminId,
        targetUserDetails: {
          currentRole: targetAdmin.adminType,
          requestedRole: newRole
        },
        reason: justification || "Role change request"
      }
    });

    return res.status(CREATED).json({
      message: "Role change request submitted successfully",
      requestDetails: {
        targetAdminId: targetAdminId,
        currentRole: targetAdmin.adminType,
        requestedRole: newRole,
        status: "PENDING"
      },
      submittedBy: actor.adminId
    });

  } catch (err) {
    logWithTime(`❌ Internal Error in submitting role change request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

/**
 * Approve Role Change Request Controller
 * Approves a pending role change request and updates admin role
 */
const approveRoleChangeRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId, comments } = req.body;

    // TODO: Fetch role change request from database
    // const roleChangeRequest = await RoleChangeRequestModel.findById(requestId);
    // if (!roleChangeRequest) {
    //   return throwNotFoundError(res, "Role change request not found");
    // }

    // TODO: Update target admin's role
    // const targetAdmin = await AdminModel.findOne({ adminId: roleChangeRequest.targetAdminId });
    // targetAdmin.adminType = roleChangeRequest.requestedRole;
    // targetAdmin.updatedBy = actor.adminId;
    // await targetAdmin.save();

    // TODO: Update request status
    // roleChangeRequest.status = 'APPROVED';
    // roleChangeRequest.approvedBy = actor.adminId;
    // roleChangeRequest.approvedAt = new Date();
    // roleChangeRequest.comments = comments;
    // await roleChangeRequest.save();

    logWithTime(`✅ Role change request ${requestId} approved by ${actor.adminId}`);

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.ROLE_CHANGE_REQUEST_APPROVED, {
      description: `Role change request ${requestId} approved by ${actor.adminId}`,
      adminActions: {
        requestId: requestId,
        reason: comments || "Role change approved"
      }
    });

    return res.status(OK).json({
      message: "Role change request approved successfully",
      requestId: requestId,
      approvedBy: actor.adminId
    });

  } catch (err) {
    logWithTime(`❌ Internal Error in approving role change request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

/**
 * Reject Role Change Request Controller
 * Rejects a pending role change request
 */
const rejectRoleChangeRequest = async (req, res) => {
  try {
    const actor = req.admin;
    const { requestId, rejectionReason } = req.body;

    if (!rejectionReason) {
      logWithTime(`❌ Rejection reason not provided ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Rejection reason is required");
    }

    // TODO: Fetch and update role change request
    // const roleChangeRequest = await RoleChangeRequestModel.findById(requestId);
    // if (!roleChangeRequest) {
    //   return throwNotFoundError(res, "Role change request not found");
    // }

    // roleChangeRequest.status = 'REJECTED';
    // roleChangeRequest.rejectedBy = actor.adminId;
    // roleChangeRequest.rejectedAt = new Date();
    // roleChangeRequest.rejectionReason = rejectionReason;
    // await roleChangeRequest.save();

    logWithTime(`✅ Role change request ${requestId} rejected by ${actor.adminId}`);

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.ROLE_CHANGE_REQUEST_REJECTED, {
      description: `Role change request ${requestId} rejected by ${actor.adminId}`,
      adminActions: {
        requestId: requestId,
        reason: rejectionReason
      }
    });

    return res.status(OK).json({
      message: "Role change request rejected",
      requestId: requestId,
      rejectedBy: actor.adminId,
      reason: rejectionReason
    });

  } catch (err) {
    logWithTime(`❌ Internal Error in rejecting role change request ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { 
  submitRoleChangeRequest,
  approveRoleChangeRequest,
  rejectRoleChangeRequest
};
