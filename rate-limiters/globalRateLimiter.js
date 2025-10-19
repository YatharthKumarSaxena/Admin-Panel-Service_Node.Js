// middlewares/globalRateLimiter.js
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const { redisClient } = require("../utils/redisClient");
const { errorMessage, throwInternalServerError } = require("../config/error-handler.config");
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
            const userID = req?.user?.userID || "UNKNOWN_USER";
            const deviceID = req?.deviceID || "UNKNOWN_DEVICE";

            logWithTime("🚫 Rate Limit Triggered:");
            logWithTime(`IP: ${ip} | Path: ${path} | User: ${userID} | Device: ${deviceID}`);
            errorMessage(new Error("Rate limit exceeded"));
            return res.status(options.statusCode).json(options.message);
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
