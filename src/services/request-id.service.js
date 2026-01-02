const { CounterModel } = require("@models/counter.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { errorMessage } = require("@utils/error-handler.util");
const { IP_Address_Code } = require("@configs/system.config");

/**
 * Generate unique request ID for admin status requests
 * Format: REQ{IP_Code}{Sequence}
 * Example: REQIN001, REQIN002
 */
const makeRequestId = async () => {
  try {
    const requestIdPrefix = "REQ";
    const counter = await CounterModel.findOneAndUpdate(
      { _id: requestIdPrefix },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!counter) {
      logWithTime("🛑 Critical: Failed to generate or retrieve request counter.");
      return "";
    }

    const requestId = `${requestIdPrefix}${IP_Address_Code}${counter.seq.toString().padStart(6, '0')}`;
    return requestId;

  } catch (err) {
    logWithTime("🛑 Error in makeRequestId process");
    errorMessage(err);
    return "";
  }
};

module.exports = {
  makeRequestId
};
