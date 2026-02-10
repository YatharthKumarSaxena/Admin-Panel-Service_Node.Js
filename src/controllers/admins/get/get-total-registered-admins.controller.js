const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { getAdminStatsSuccessResponse } = require("@/responses/success/admin.response");
const { getAdminStatsService } = require("@/services/admins/get/get-admin-stats.service");

const getAdminDashboardStats = async (req, res) => {
    try {
        // Call service
        const result = await getAdminStatsService();

        if (!result.success) {
            return throwInternalServerError(res, result.message);
        }

        logWithTime(`📊 Admin dashboard stats fetched by ${req.admin.adminId} ${getLogIdentifiers(req)}`);

        return getAdminStatsSuccessResponse(res, result.data);
    } catch (err) {
        logWithTime(`❌ Failed to fetch admin dashboard stats ${getLogIdentifiers(req)}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { getAdminDashboardStats };
