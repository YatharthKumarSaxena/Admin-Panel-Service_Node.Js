const { createRedisDeviceRateLimiter } = require("../factories/createRedisDeviceRateLimiter");
const { malformedRequest, unknownRoute } = require("../configs/rate-limit.config");

const malformedAndWrongRequestRateLimiter = createRedisDeviceRateLimiter({
  maxRequests: malformedRequest.maxRequests,
  windowMs: malformedRequest.windowMs,
  prefix: "malformedRequest",
  reason: "Malformed request",
  message: "Too many malformed requests. Please fix your payload and try again later."
});

const unknownRouteLimiter = createRedisDeviceRateLimiter({
  maxRequests: unknownRoute.maxRequests,
  windowMs: unknownRoute.windowMs,
  prefix: "unknownRoute",
  reason: "Unknown route access",
  message: "Too many invalid or unauthorized requests. Please slow down."
});

module.exports = {
  malformedAndWrongRequestRateLimiter,
  unknownRouteLimiter
};