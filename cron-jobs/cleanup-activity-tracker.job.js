const cron = require("node-cron");
const ActivityTrackerModel = require("../models/activity-tracker.model");
const { logWithTime } = require("../utils/time-stamps.utils");
const { activityTrackerCleanup } = require("../configs/cron.config");
const { errorMessage} = require("../configs/error-handler.configs");

const cleanActivityLogs = async () => {
  try {
    if(!activityTrackerCleanup.enable)return;
    if (!activityTrackerCleanup.deactivatedRetentionDays || activityTrackerCleanup.deactivatedRetentionDays < 1) {
      logWithTime("⚠️ Invalid retention days configuration. Skipping activity log cleanup.");
      return;
    }
    const cutoffDate = new Date(Date.now() - activityTrackerCleanup.deactivatedRetentionDays * 24 * 60 * 60 * 1000);
    logWithTime("📅 [CRON-JOB] ➤ Activity Logs Cleanup Started...");
    const result = await ActivityTrackerModel.deleteMany({
      createdAt: { $lt: cutoffDate }
    });
    await logAuthEvent({
      admin: { adminID: "SYSTEM_BATCH_CRON", adminType: "SYSTEM" },
      deviceID: process.env.DEVICE_UUID,
      deviceName: process.env.DEVICE_NAME,
      deviceType: process.env.DEVICE_TYPE
    }, "CLEAN_UP_ACTIVITY_LOGS", {
    reason: `Deleted ${result.deletedCount} activity logs (> ${activityTrackerCleanup.deactivatedRetentionDays} days)`
    });
    if(result.deletedCount === 0){
      logWithTime(`📭 No activity logs eligible for deletion (older than ${activityTrackerCleanup.deactivatedRetentionDays} days).`);
    }else {
      logWithTime(`🗑️ Activity Logs Deletion Job: ${result.deletedCount} activity logs hard deleted (created > ${activityTrackerCleanup.deactivatedRetentionDays} days).`);
    }
  } catch (err) {
    logWithTime("❌ Internal Error in deleting old activity logs by Cron Job.");
    errorMessage(err);
    return;
  }
};

// ⏰ Run on schedule
cron.schedule(activityTrackerCleanup.cronSchedule, cleanActivityLogs, {
  timezone: activityTrackerCleanup.timezone
});