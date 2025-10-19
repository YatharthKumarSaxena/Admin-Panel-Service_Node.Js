const { createRedisDeviceRateLimiter } = require("../factories/createRedisDeviceRateLimiter");
const { malformedRequest } = require("../configs/rate-limit.config");

const malformedAndWrongRequestRateLimiter = createRedisDeviceRateLimiter({
  maxRequests: malformedRequest.maxRequests,
  windowMs: malformedRequest.windowMs,
  prefix: "malformedRequest",
  reason: "Malformed request",
  message: "Too many malformed requests. Please fix your payload and try again later."
});

module.exports = {
  malformedAndWrongRequestRateLimiter
};