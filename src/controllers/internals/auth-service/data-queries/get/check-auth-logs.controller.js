const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, throwBadRequestError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { checkAuthLogsSuccessResponse } = require("@/responses/success/index");

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
      return throwBadRequestError(res, "targetId is required");
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

    logWithTime(`✅ Admin ${actor.adminId} checked auth logs for ${targetId}`);

    return checkAuthLogsSuccessResponse(res, authLogs.logs);

  } catch (err) {
    logWithTime(`❌ Internal Error in checking auth logs ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { checkAuthLogs };