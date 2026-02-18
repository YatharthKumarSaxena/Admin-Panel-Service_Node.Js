const { CounterModel } = require("@models/counter.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { errorMessage } = require("@/responses/common/error-handler.response");
const { idPrefix } = require("@configs/id-prefixes.config");

/**
 * Rollback counter after failed creation
 * Decrements the sequence to avoid gaps in adminId
 * @returns {Promise<boolean>} Success status
 */

const rollbackIdCounter = async (prefix) => {
  try {
    if(!Object.values(idPrefix).includes(prefix)){
      logWithTime(`⚠️ Invalid prefix provided for rollback: ${prefix}`);
      return false;
    }

    const counter = await CounterModel.findOneAndUpdate(
      { _id: prefix },
      { $inc: { seq: -1 } },
      { new: true }
    );

    if (!counter) {
      logWithTime(`⚠️ Failed to rollback counter for prefix ${prefix} - counter not found`);
      return false;
    }

    if (counter.seq < 0) {
      // Prevent negative sequence
      await CounterModel.findOneAndUpdate(
        { _id: prefix },
        { $set: { seq: 0 } }
      );
      logWithTime("⚠️ Counter was negative, reset to 0");
    }

    logWithTime(`✅ Counter rolled back to: ${counter.seq}`);
    return true;

  } catch (err) {
    logWithTime("❌ Error in rollbackIdCounter");
    errorMessage(err);
    return false;
  }
};

module.exports = {
  rollbackIdCounter
};
