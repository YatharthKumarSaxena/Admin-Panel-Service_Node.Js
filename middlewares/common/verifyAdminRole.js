const { logWithTime } = require("../../utils/time-stamps.utils");
const { errorMessage, throwInternalServerError,  getLogIdentifiers, throwAccessDeniedError, logMiddlewareError } = require("../../configs/error-handler.configs");

// Checking Provided Request is given by admin or not
const isAdmin = (req,res,next) => {
    try{
        const admin = req.admin;
        if(!admin.adminType){
            // Admin not present, access denied
            logMiddlewareError(`Is Admin, Access Denied for non-admin admin: (${admin.userID})`, req);
            return throwAccessDeniedError(res,"Admin, Admins only");
        }
        return next();
    }catch(err){
        const getIdentifiers = getLogIdentifiers(req);
        logWithTime(`❌ An Internal Error Occurred while checking admin is Admin or not ${getIdentifiers}`);
        errorMessage(err);
        return throwInternalServerError(res);
    }
}

module.exports = {
    isAdmin
}