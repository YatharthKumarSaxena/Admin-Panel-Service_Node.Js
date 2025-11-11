const {logWithTime} = require("../utils/time-stamps.utils");
const { INTERNAL_ERROR } = require("./http-status.config");

/**
 * 🔥 Catches all uncaught errors thrown anywhere in the route chain.
 * ✅ Logs detailed message and prevents server crash
 */
exports.globalErrorHandler = (err, req, res, next) => {
    logWithTime("💥 Uncaught Server Error: " + err.message);

    // Optional: stack trace in development
    if (process.env.NODE_ENV === "development") {
        console.log(err.stack);
    }

    if (res.headersSent) return; // 🔐 Prevent duplicate response

    return res.status(INTERNAL_ERROR).json({
        success: false,
        type: "InternalServerError",
        message: "🔧 Internal Server Error! Please try again later."
    });
};