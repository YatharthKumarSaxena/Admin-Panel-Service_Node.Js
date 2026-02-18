const { CounterModel } = require("@models/counter.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { errorMessage } = require("@/responses/common/error-handler.response");
const { totalRequestCapacity } = require("@configs/app-limits.config");
const { requestIdPrefix } = require("@configs/id-prefixes.config");
const { IP_Address_Code } = require("@configs/ip-address.config");

/**
 * Generate unique request ID for admin status requests
 * Format: REQ{IP_Code}{Sequence}
 * Example: REQIN001, REQIN002
 */

const makeRequestId = async () => {
  try {
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
    const identityCode = `${requestIdPrefix}${IP_Address_Code}`;
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
