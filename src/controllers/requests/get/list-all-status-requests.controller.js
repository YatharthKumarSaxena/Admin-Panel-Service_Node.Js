const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { listAllStatusRequestsService } = require("@/services/requests/get/list-all-status-requests.service");
const { listAllStatusRequestsSuccessResponse } = require("@/responses/success/request.response");

/**
 * List All Status Requests Controller
 * Hierarchical + secure list with safe search
 */

const listAllStatusRequests = async (req, res) => {
  try {
    const actor = req.admin;
    const queryParams = req.query;

    const result = await listAllStatusRequestsService(actor, queryParams);

    logWithTime(
      `✅ Status requests fetched by ${actor.adminId}: ${result.data.requests.length}/${result.data.totalCount}`
    );

    return listAllStatusRequestsSuccessResponse(
      res,
      result.data.requests,
      result.data.totalCount,
      result.data.page,
      result.data.limit
    );

  } catch (err) {
    logWithTime(`❌ Error fetching status requests: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listAllStatusRequests };
