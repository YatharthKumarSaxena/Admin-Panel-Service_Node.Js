// middlewares/factories/createRateLimiter.js
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const { redisClient } = require("../../utils/redisClient");
const { logWithTime } = require("../../utils/time-stamps.utils");
const { errorMessage } = require("../../config/error-handler.config");

const createRateLimiter = ({ maxRequests, windowMs }) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args)
    }),
    keyGenerator: (req) => {
      const userID = req?.user?.userID || "ANON_USER";
      const deviceID = req?.deviceID || "UNKNOWN_DEVICE";
      const path = req.originalUrl || req.url;
      return `${userID}:${deviceID}:${path}`;
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
      const userID = req?.user?.userID || "UNKNOWN_USER";
      const deviceID = req?.deviceID || "UNKNOWN_DEVICE";

      logWithTime("🚫 Rate Limit Triggered:");
      logWithTime(`IP: ${ip} | Path: ${path} | User: ${userID} | Device: ${deviceID}`);
      errorMessage(new Error("Rate limit exceeded"));
      return res.status(options.statusCode).json(options.message);
    }
  });
};

module.exports = {
  createRateLimiter
};
