// configs/enums.config.js

const AdminActionReasons = Object.freeze({
  CHECK_USER_ACTIVITY: "ToCheckUserActivity",           // Audit-safe
  VERIFY_ACCOUNT_STATUS: "ToVerifyAccountStatus",
  AUDIT_LOG_PURPOSE: "ToAuditUserLogs",
  RESET_PASSWORD_REQUESTED: "PasswordResetVerification",
  USER_RAISED_ISSUE: "UserRaisedIssue",
  ACCOUNT_VERIFICATION: "VerifyUserManually"
});

const BlockReasons = Object.freeze({
  POLICY_VIOLATION: "policy_violation",                 // DB-safe
  SPAM_ACTIVITY: "spam_activity",
  HARASSMENT: "harassment",
  FRAUDULENT_BEHAVIOR: "fraudulent_behavior",
  SUSPICIOUS_LOGIN: "suspicious_login",
  OTHER: "other"
});

const UnblockReasons = Object.freeze({
  MANUAL_REVIEW_PASSED: "manual_review_passed",         // DB-safe
  USER_APPEAL_GRANTED: "user_appeal_granted",
  SYSTEM_ERROR: "system_error",
  OTHER: "other"
});

const BlockVia = Object.freeze({
  BY_USER_ID: "user_id",                                // DB-safe
  BY_EMAIL: "email",
  BY_PHONE: "phone"
});

const UnblockVia = Object.freeze({
  BY_USER_ID: "user_id",                                // DB-safe
  BY_EMAIL: "email",
  BY_PHONE: "phone"
});

const UserType = Object.freeze({
  CUSTOMER: "customer",                                 // DB-safe
  ADMIN: "admin"
});

const DeviceType = Object.freeze({
    MOBILE: "mobile", 
    TABLET: "tablet", 
    LAPTOP: "laptop"
});

const PerformedBy = Object.freeze({
  ADMIN: "admin",
  SYSTEM: "system"
});


module.exports = {
  AdminActionReasons,   // PascalCase values → audit logs
  BlockReasons,         // snake_case values → DB/API
  UnblockReasons,
  BlockVia,
  UnblockVia,
  UserType,
  DeviceType,
  PerformedBy
};
