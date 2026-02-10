const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { listAuthLogsSuccessResponse } = require("@/responses/success/internal.response");

/**
 * List Auth Logs Controller
 * Retrieves aggregated authentication logs for monitoring
 * Filters: status, date range, action type
 * NO individual targeting - for dashboard/analytics only
 */

const listAuthLogs = async (req, res) => {
  try {
    const actor = req.admin;
    const { 
      page = 1,
      limit = 50, 
      status,         // SUCCESS, FAILED, BLOCKED
      actionType,     // LOGIN, LOGOUT, TOKEN_REFRESH
      dateFrom, 
      dateTo,
      sortBy = 'timestamp',
      sortOrder = 'desc',
      reason
    } = req.query;

    logWithTime(`📊 Admin ${actor.adminId} (${actor.adminType}) requesting auth logs list`);

    // TODO: Make API call to Authentication Service for aggregated logs
    // const authLogsList = await fetchAuthLogsListFromAuthService({
    //   requestedBy: actor.adminId,
    //   requestedByType: actor.adminType,
    //   page, limit, status, actionType, dateFrom, dateTo, sortBy, sortOrder
    // });

    // Placeholder response
    const authLogsList = {
      totalLogs: 0,
      logs: [],
      message: "Auth Service integration pending",
      note: "Aggregated logs for monitoring - no individual targeting"
    };

    logWithTime(`✅ Admin ${actor.adminId} viewed auth logs dashboard`);

    return listAuthLogsSuccessResponse(res, authLogsList.logs, authLogsList.totalLogs, page, limit);

  } catch (err) {
    logWithTime(`❌ Error fetching auth logs list ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listAuthLogs };