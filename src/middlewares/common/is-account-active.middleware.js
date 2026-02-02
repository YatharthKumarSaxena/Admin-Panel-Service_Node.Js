const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, logMiddlewareError } = require("@/responses/common/error-handler.response");
const { FORBIDDEN } = require("@configs/http-status.config");
const { AdminType } = require("@configs/enums.config");

// ✅ Checking if admin Account is Active
const isAdminAccountActive = async (req, res, next) => {
    try {
        const admin = req.admin;
        if (admin.adminType === AdminType.SUPER_ADMIN) { // Super Admin Account can never be deactivated
            logWithTime(`✅ Super Admin (${admin.adminId}) bypassed deactivation check`);
            return next();
        }
        if (admin.isActive === false) {
            logMiddlewareError("isAdminAccountActive", "Admin account is deactivated", req);
            return res.status(FORBIDDEN).json({
                success: false,
                message: "Your account is currently deactivated.",
                suggestion: "Please activate your account before continuing."
            });
        }
        // ✅ Active admin – Allow to proceed
        return next();
    } catch (err) {
        logMiddlewareError("isAdminAccountActive", "Internal error during admin active check", req);
        return throwInternalServerError(res, err);
    }
}

module.exports = {
    isAdminAccountActive
}