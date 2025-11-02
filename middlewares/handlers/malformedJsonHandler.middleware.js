const { malformedAndWrongRequestRateLimiter } = require("../../rate-limiters/deviceBasedRateLimiters");
const { logWithTime } = require("../../utils/time-stamps.utils");

const malformedJsonHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    logWithTime(`❌ Malformed JSON in ${req.method} ${req.originalUrl}`);

    return malformedAndWrongRequestRateLimiter(req, res, () => {
      return res.status(400).json({
        code: "MALFORMED_JSON",
        message: "Invalid JSON syntax in request body"
      });
    });
  }
  next(err);
};

module.exports = { malformedJsonHandler };
