/**
 * ENV DEFAULTS
 * Safe defaults for non-critical configuration
 */

function applyEnvDefaults() {

  /* ------------------ 🌐 Environment ------------------ */
  process.env.NODE_ENV ||= "development";
  process.env.PORT_NUMBER ||= "8080";

  /* ------------------ 🍃 MongoDB ------------------ */
  process.env.DB_NAME ||= "admin_panel_service_db";
  process.env.DB_URL ||= "mongodb://localhost/admin_panel_service_db";

  /* ------------------ 🔴 Redis ------------------ */
  process.env.REDIS_HOST ||= "127.0.0.1";
  process.env.REDIS_PORT ||= "6379";
  process.env.REDIS_PASSWORD ||= "";
  process.env.REDIS_DB ||= "0";
  process.env.REDIS_MAX_RETRY_ATTEMPTS ||= "10";
  process.env.REDIS_RETRY_INITIAL_DELAY ||= "100";
  process.env.REDIS_RETRY_MAX_DELAY ||= "2000";

  /* ------------------ 🚦 Rate Limiting ------------------ */
  process.env.RATE_LIMIT_WINDOW ||= "10";
  process.env.RATE_LIMIT_MAX ||= "100";

  /* ------------------ 🍪 Cookie Security ------------------ */
  process.env.COOKIE_HTTP_ONLY ||= "true";
  process.env.COOKIE_SECURE ||= "false";
  process.env.COOKIE_SAME_SITE ||= "Strict";

  /* ------------------ 🧾 Audit ------------------ */
  process.env.AUDIT_MODE ||= "CHANGED_ONLY";
  process.env.ACTIVITY_TRACKER_RETENTION_DAYS ||= "90";
  process.env.ACTIVITY_TRACKER_CLEANUP_TIMEZONE ||= "Asia/Kolkata";

  /* ------------------ 🧠 Feature Flags ------------------ */
  process.env.ACTIVITY_TRACKING_ENABLED ||= "true";
  process.env.ADVANCED_LOGGING_ENABLED ||= "false";

  process.env.IS_2FA_FEATURE_ENABLED ||= "false";

  /* ------------------ 🏗 Infrastructure ------------------ */
  process.env.IP_ADDRESS_CODE ||= "1";
  process.env.USER_REGISTRATION_CAPACITY ||= "100000";
  process.env.ADMIN_REGISTRATION_CAPACITY ||= "100000";
  process.env.REQUEST_DATA_CAPACITY ||= "100000";

  /* ------------------ 📱 Device Defaults ------------------ */
  process.env.DEVICE_NAME ||= "System Device";
  process.env.DEVICE_TYPE ||= "LAPTOP";
  process.env.DEVICE_UUID ||= "00000000-0000-4000-8000-000000000000";

  /* ------------------ ✅ Whitelist ------------------ */
  process.env.WHITELISTED_DEVICE_UUIDS ||= "";

}

module.exports = { applyEnvDefaults };