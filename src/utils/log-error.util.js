const { logWithTime } = require("./time-stamps.util");

const errorMessage = (err) => {
    logWithTime("🛑 Error occurred:");
    logWithTime("File Name and Line Number where this error occurred is displayed below:- ");
    console.log(err.stack);
    logWithTime("Error Message is displayed below:- ");
    console.error(err.message);
}

const getLogIdentifiers = (req) => {
    const adminId = req?.foundAdmin?.adminId || req?.admin?.adminId || "UNKNOWN_admin";
    const deviceUUID = req?.device?.deviceUUID || "UNKNOWN_DEVICE";
    return `with admin ID: (${adminId}). Request is made from device ID: (${deviceUUID})`;
};

const logMiddlewareError = (middlewareName, reason, req) => {
  const adminId = req?.admin?.adminId || "UNKNOWN_admin";
  const deviceUUID = req?.device?.deviceUUID || "UNKNOWN_DEVICE";
  logWithTime(`❌ [${middlewareName}Middleware] Error: ${reason} | admin: (${adminId}) | device: (${deviceUUID})`);
};

module.exports = {
    logMiddlewareError,
    getLogIdentifiers,
    errorMessage
}