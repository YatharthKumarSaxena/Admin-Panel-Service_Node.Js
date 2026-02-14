// 📅 configs/cron.config.js

const { getMyEnv, getMyEnvAsNumber, getMyEnvAsBool } = require("@/utils/env.util");

module.exports = {
  activityTrackerCleanup: {
    enable: getMyEnvAsBool('ACTIVITY_TRACKER_CLEANUP_ENABLED', true),
    cronSchedule: getMyEnv('ACTIVITY_TRACKER_CLEANUP_CRON', '0 5 * * 0'),
    timezone: getMyEnv('ACTIVITY_TRACKER_CLEANUP_TIMEZONE', 'Asia/Kolkata'),
    deactivatedRetentionDays: getMyEnvAsNumber('ACTIVITY_TRACKER_CLEANUP_RETENTION_DAYS', 90)
  },

  adminCleanup: {
    enable: getMyEnvAsBool('ADMIN_CLEANUP_ENABLED', true),
    cronSchedule: getMyEnv('ADMIN_CLEANUP_CRON', '0 4 * * 0'), // ⏰ Sunday 4 AM
    timezone: getMyEnv('ADMIN_CLEANUP_TIMEZONE', 'Asia/Kolkata'),
    deactivatedRetentionDays: getMyEnvAsNumber('ADMIN_CLEANUP_RETENTION_DAYS', 120)
  },

  requestCleanup: {
    enable: getMyEnvAsBool('REQUEST_CLEANUP_ENABLED', true),
    cronSchedule: getMyEnv('REQUEST_CLEANUP_CRON', '0 2 * * 0'), // ⏰ Sunday 2 AM
    timezone: getMyEnv('REQUEST_CLEANUP_TIMEZONE', 'Asia/Kolkata'),
    processedRetentionDays: getMyEnvAsNumber('REQUEST_CLEANUP_RETENTION_DAYS', 60) // 2 months
  },

  permissionCleanup: {
    enable: getMyEnvAsBool('PERMISSION_CLEANUP_ENABLED', true),
    cronSchedule: getMyEnv('PERMISSION_CLEANUP_CRON', '0 3 * * 0'), // ⏰ Sunday 3 AM
    timezone: getMyEnv('PERMISSION_CLEANUP_TIMEZONE', 'Asia/Kolkata'),
    deactivatedRetentionDays: getMyEnvAsNumber('PERMISSION_CLEANUP_RETENTION_DAYS', 90)
  },

  serviceTrackerCleanup: {
    enable: getMyEnvAsBool('SERVICE_TRACKER_CLEANUP_ENABLED', true),
    cronSchedule: getMyEnv('SERVICE_TRACKER_CLEANUP_CRON', '0 1 * * 0'), // ⏰ Sunday 1 AM
    timezone: getMyEnv('SERVICE_TRACKER_CLEANUP_TIMEZONE', 'Asia/Kolkata'),
    retentionDays: getMyEnvAsNumber('SERVICE_TRACKER_CLEANUP_RETENTION_DAYS', 90)
  }

  // Note: User cleanup is handled by Auth Service
  // Auth Service will notify Admin Panel Service via internal API when users are deleted
};
