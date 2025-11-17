const { throwInternalServerError } = require("../../utils/error-handler.utils");
const {logWithTime} = require("../utils/time-stamps.utils");

/**
 * 🔥 Catches all uncaught errors thrown anywhere in the route chain.
 * ✅ Logs detailed message and prevents server crash
 */

const globalErrorHandler = (err, req, res, next) => {
    logWithTime("💥 Uncaught Server Error: " + err.message);

    if (res.headersSent) return; // 🔐 Prevent duplicate response

    return throwInternalServerError(res, err);
};

module.exports = { globalErrorHandler };