// 📅 configs/cron.config.js

module.exports = {
  activityTrackerCleanup: {
    enable: true,
    cronSchedule: process.env.ACTIVITY_TRACKER_CLEANUP_CRON || "0 5 * * 0", // ⏰ Sunday 5 AM
    timezone: process.env.ACTIVITY_TRACKER_CLEANUP_TIMEZONE || "Asia/Kolkata",
    deactivatedRetentionDays: Number(process.env.ACTIVITY_TRACKER_CLEANUP_RETENTION_DAYS) || 90
  },

  adminCleanup: {
    enable: true,
    cronSchedule: process.env.ADMIN_CLEANUP_CRON || "0 4 * * 0", // ⏰ Sunday 4 AM
    timezone: process.env.ADMIN_CLEANUP_TIMEZONE || "Asia/Kolkata",
    deactivatedRetentionDays: Number(process.env.ADMIN_CLEANUP_RETENTION_DAYS) || 120
  },

  requestCleanup: {
    enable: true,
    cronSchedule: process.env.REQUEST_CLEANUP_CRON || "0 2 * * 0", // ⏰ Sunday 2 AM
    timezone: process.env.REQUEST_CLEANUP_TIMEZONE || "Asia/Kolkata",
    processedRetentionDays: Number(process.env.REQUEST_CLEANUP_RETENTION_DAYS) || 60 // 2 months
  }

  // Note: User cleanup is handled by Auth Service
  // Auth Service will notify Admin Panel Service via internal API when users are deleted
};
