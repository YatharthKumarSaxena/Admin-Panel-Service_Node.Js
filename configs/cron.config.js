// 📅 configs/cron.config.js

module.exports = {
  activityTrackerCleanup: {
    enable: true,
    cronSchedule: process.env.ACTIVITY_TRACKER_CLEANUP_CRON || "0 5 * * 0",           // ⏰ Default: Sunday 5 AM
    timezone: process.env.ACTIVITY_TRACKER_CLEANUP_TIMEZONE || "Asia/Kolkata",
    deactivatedRetentionDays: Number(process.env.ACTIVITY_TRACKER_CLEANUP_RETENTION_DAYS) || 90
  }
};