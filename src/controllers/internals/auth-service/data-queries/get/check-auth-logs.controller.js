const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");

/**
 * Check Auth Logs Controller
 * Forwards request to Authentication Service with admin credentials
 * Access control handled by Auth Service
 * 
 * NOTE: This will require integration with Authentication Service API
 */

const checkAuthLogs = async (req, res) => {
  try {
    const actor = req.admin;
    const { 
      targetId,       // User ID or Admin ID to check logs for
      limit = 50, 
      offset = 0, 
      startDate, 
      endDate,
      reason
    } = req.query;

    if (!targetId) {
      return res.status(400).json({
        message: "targetId is required"
      });
    }

    logWithTime(`🔍 Admin ${actor.adminId} (${actor.adminType}) requesting auth logs for: ${targetId}`);

    // TODO: Make API call to Authentication Service
    // Auth Service will handle access control internally
    // const authLogs = await fetchAuthLogsFromAuthService(targetId, {
    //   requestedBy: actor.adminId,
    //   requestedByType: actor.adminType,
    //   limit, offset, startDate, endDate
    // });

    // Placeholder response (to be replaced with actual Auth Service integration)
    const authLogs = {
      targetId: targetId,
      totalLogs: 0,
      logs: [],
      message: "Auth Service integration pending",
      note: "Access control will be enforced by Authentication Service"
    };

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.CHECK_AUTH_LOGS, {
      description: `Admin ${actor.adminId} checked auth logs for ${targetId}`,
      adminActions: {
        targetId: targetId,
        reason: reason
      }
    });

    return res.status(OK).json({
      message: "Auth logs retrieved successfully",
      data: authLogs,
      checkedBy: actor.adminId,
      checkedByType: actor.adminType
    });

  } catch (err) {
    logWithTime(`❌ Internal Error in checking auth logs ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { checkAuthLogs };