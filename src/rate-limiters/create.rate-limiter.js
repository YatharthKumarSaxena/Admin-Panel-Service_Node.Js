// middlewares/factories/createRateLimiter.js
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const { redisClient } = require("../utils/redis-client.util");
const { logWithTime } = require("../utils/time-stamps.util");
const { errorMessage } = require("../configs/error-handler.configs");

const createRateLimiter = ({ maxRequests, windowMs }) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args)
    }),
    keyGenerator: (req) => {
      const adminId = req.admin.adminId; // ❌ remove fallback
      const deviceId = req.deviceId;   // ❌ remove fallback
      const path = req.originalUrl || req.url;

      return `${adminId}:${deviceId}:${path}`;
    },
    windowMs,
    max: maxRequests,
    message: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again after some time.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      const ip = req.ip || req.headers["x-forwarded-for"] || "UNKNOWN_IP";
      const path = req.originalUrl || req.url;
      const adminId = req.admin.adminId;
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
};

module.exports = {
  createRateLimiter
};
