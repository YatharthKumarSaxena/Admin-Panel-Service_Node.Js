const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");

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

    // Log activity (NO reason needed for list view)
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.LIST_AUTH_LOGS, {
      description: `Admin ${actor.adminId} viewed auth logs dashboard`,
      adminActions: {
        reason: reason
      }
    });

    return res.status(OK).json({
      message: "Auth logs list retrieved successfully",
      data: authLogsList,
      pagination: {
        currentPage: parseInt(page),
        recordsPerPage: parseInt(limit)
      },
      viewedBy: actor.adminId
    });

  } catch (err) {
    logWithTime(`❌ Error fetching auth logs list ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listAuthLogs };