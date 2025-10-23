const { logWithTime } = require("../../utils/time-stamps.utils");
const { errorMessage, throwInternalServerError, logMiddlewareError } = require("../../configs/error-handler.configs");
const { FORBIDDEN } = require("../../configs/http-status.config");
const { UserType } = require("../../configs/enums.config");

// ✅ Checking if admin Account is Active
const isAdminAccountActive = async (req, res, next) => {
    try {
        const admin = req.admin;
        if (admin.adminType === UserType.SUPER_ADMIN) { // Super Admin Account can never be deactivated
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
        errorMessage(err);
        return throwInternalServerError(res);
    }
}

module.exports = {
    isAdminAccountActive
}