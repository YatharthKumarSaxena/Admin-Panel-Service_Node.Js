const { unknownRouteLimiter } = require("../../rate-limiters/device-based.rate-limiter");
const { logWithTime } = require("../../utils/time-stamps.util");

const unknownRouteHandler = (req, res) => {
  logWithTime(`❌ Unknown route hit: ${req.method} ${req.originalUrl}`);

  return unknownRouteLimiter(req, res, () => {
    return res.status(404).json({
      code: "UNKNOWN_ROUTE",
      message: "The requested endpoint does not exist"
    });
  });
};

module.exports = { unknownRouteHandler };
