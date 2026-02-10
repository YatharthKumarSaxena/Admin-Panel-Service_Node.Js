const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { getUserStatsSuccessResponse } = require("@/responses/success/user.response");
const { getUserStatsService } = require("@/services/users/get/get-user-stats.service");

/**
 * Get Total Registered Users Controller
 * Returns count of total registered users with optional filters
 */

const getTotalRegisteredUsers = async (req, res) => {
  try {
    const admin = req.admin;
    const { includeBlocked = false, startDate, endDate } = req.query;

    logWithTime(`📊 Admin ${admin.adminId} requesting total registered users count`);

    // Call service
    const result = await getUserStatsService({
      includeBlocked,
      startDate,
      endDate
    });

    if (!result.success) {
      return throwInternalServerError(res, result.message);
    }

    logWithTime(`✅ Total users count: ${result.data.totalRegistered} retrieved by ${admin.adminId}`);

    return getUserStatsSuccessResponse(res, result.data);

  } catch (err) {
    logWithTime(`❌ Internal Error in getting total users ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { getTotalRegisteredUsers };
