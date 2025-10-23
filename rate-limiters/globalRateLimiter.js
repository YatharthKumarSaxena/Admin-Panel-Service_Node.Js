// middlewares/globalRateLimiter.js
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const { redisClient } = require("../utils/redisClient.utils");
const { errorMessage, throwInternalServerError } = require("../configs/error-handler.configs");
const { logWithTime } = require("../utils/time-stamps.utils");

let globalLimiter;

try {
    globalLimiter = rateLimit({
        store: new RedisStore({
            sendCommand: (...args) => redisClient.call(...args)
        }),
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 600000,
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
        message: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please try again after some time.",
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next, options) => {
            const ip = req.ip || req.headers["x-forwarded-for"] || "UNKNOWN_IP";
            const path = req.originalUrl || req.url;
            const adminId = req?.admin?.adminId || "UNKNOWN_Admin";
            const deviceId = req.deviceId;
            const resetTime = req.rateLimit?.resetTime;
            const retryAfterSeconds = resetTime
                ? Math.ceil((resetTime.getTime() - Date.now()) / 1000)
                : null;
            logWithTime("🚫 Rate Limit Triggered:");
            logWithTime(`IP: ${ip} | Path: ${path} | Admin: ${adminId} | Device: ${deviceId}`);
            errorMessage(new Error("Rate limit exceeded"));
            const responsePayload = {
                code: "RATE_LIMIT_EXCEEDED",
                message: "Too many requests. Please try again after some time.",
                ...(retryAfterSeconds && { retryAfterSeconds })
            };
            return res.status(options.statusCode).json(responsePayload);
        }
    });

    // Optional: Redis connection error logging
    redisClient.on("error", (err) => {
        errorMessage(err);
    });

} catch (err) {
    errorMessage(err);
    // Optional fallback middleware if Redis fails
    globalLimiter = (req, res, next) => {
        throwInternalServerError(res);
    };
}

module.exports = {
    globalLimiter
};
