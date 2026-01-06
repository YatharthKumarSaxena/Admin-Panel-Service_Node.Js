const { AdminModel } = require("@models/admin.model");
const { OK } = require("@configs/http-status.config");
const { AdminType } = require("@configs/enums.config");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");

const getAdminDashboardStats = async (req, res) => {
    try {
        const stats = await AdminModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalAdmins: { $sum: 1 },
                    activeAdmins: {
                        $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
                    },
                    inactiveAdmins: {
                        $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] }
                    },
                    totalSuperAdmins: {
                        $sum: { $cond: [{ $eq: ["$adminType", AdminType.SUPER_ADMIN] }, 1, 0] }
                    },
                    totalMidAdmins: {
                        $sum: { $cond: [{ $eq: ["$adminType", AdminType.MID_ADMIN] }, 1, 0] }
                    },
                    totalAdminsOnly: {
                        $sum: { $cond: [{ $eq: ["$adminType", AdminType.ADMIN] }, 1, 0] }
                    }
                }
            }
        ]);

        logWithTime(`📊 Admin dashboard stats fetched by ${req.admin.adminId} ${getLogIdentifiers(req)}`);

        return res.status(OK).json(stats[0] || {});
    } catch (err) {
        logWithTime(`❌ Failed to fetch admin dashboard stats ${getLogIdentifiers(req)}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { getAdminDashboardStats };
