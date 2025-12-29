const { throwInternalServerError, throwAccessDeniedError, logMiddlewareError } = require("@utils/error-handler.util");

// Checking Provided Request is given by admin or not
const isAdmin = (req,res,next) => {
    try{
        const admin = req.admin;
        if(!admin.adminType){
            logMiddlewareError("isAdmin", `Access denied for non-admin userId: ${admin.userId}`, req);
            return throwAccessDeniedError(res,"Admin, Admins only");
        }
        return next();
    }catch(err){
        logMiddlewareError("isAdmin", "❌ An Internal Error Occurred while checking admin is Admin or not", req);
        return throwInternalServerError(res, err);
    }
}

module.exports = {
    isAdmin
}