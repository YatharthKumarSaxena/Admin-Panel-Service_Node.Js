const { CounterModel } = require("@models/counter.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { errorMessage } = require("@utils/error-handler.util");
const { IP_Address_Code, requestIDPrefix, totalRequestCapacity } = require("@configs/system.config");

/**
 * Generate unique request ID for admin status requests
 * Format: REQ{IP_Code}{Sequence}
 * Example: REQIN001, REQIN002
 */

const makeRequestId = async () => {
  try {
    const requestIdPrefix = requestIDPrefix;
    const counter = await CounterModel.findOneAndUpdate(
      { _id: requestIdPrefix },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!counter) {
      logWithTime("🛑 Critical: Failed to generate or retrieve request counter.");
      return "";
    }

    // Step 2: Check Capacity
    if (counter.seq > totalRequestCapacity) {
      logWithTime("⚠️ Machine Capacity to Store Request Data is full.");
      return "0";
    }

    // Step 3: ID Construction
    const numericId = `${totalRequestCapacity+counter.seq}`; 
    const identityCode = `${requestIDPrefix}${IP_Address_Code}`;
    const requestId = `${identityCode}${numericId}`;
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
