const { logWithTime } = require("../../utils/time-stamps.utils");
const { errorMessage, throwInternalServerError,  getLogIdentifiers } = require("../../configs/error-handler.configs");
const {  FORBIDDEN } = require("../../configs/http-status.config");
const { UserType } = require("../../configs/enums.config");

// ✅ Checking if admin Account is Active
const isAdminAccountActive = async(req,res,next) => {
    try{
        const admin = req.admin;
        if(admin.adminType === UserType.SUPER_ADMIN){ // Super Admin Account can never be deactivated
            logWithTime(`✅ Super Admin (${admin.adminID}) bypassed deactivation check`);
            return next();
        }
        if(admin.isActive === false){
            logWithTime(`🚫 Access Denied: admin Account (${admin.adminID}) is Deactivated on device id: (${req.deviceID})`);
            return res.status(FORBIDDEN).json({
                success: false,
                message: "Your account is currently deactivated.",
                suggestion: "Please activate your account before continuing."
            });
        }
        // ✅ Active admin – Allow to proceed
        return next();
    }catch(err){
        const getIdentifiers = getLogIdentifiers(req);
        logWithTime(`❌ An Internal Error Occurred while checking admin Account is active or not ${getIdentifiers}`);
        errorMessage(err);
        return throwInternalServerError(res);
    }  
}

module.exports = {
    isAdminAccountActive
}