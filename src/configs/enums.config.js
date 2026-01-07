// configs/enums.config.js

const AdminUpdateRoleReasons = Object.freeze({
  PROMOTION: "Promotion",                               // Audit-safe
  DEMOTION: "Demotion",
  REORGANIZATION: "Reorganization",
  PERFORMANCE_BASED: "PerformanceBased",
  ADMIN_REQUEST: "AdminRequest",
  OTHER: "Other"
});

const AdminCreationReasons = Object.freeze({
  NEW_HIRE: "NewHire",                                   // Audit-safe
  REPLACEMENT: "Replacement",
  ROLE_EXPANSION: "RoleExpansion",
  TEMPORARY_ASSIGNMENT: "TemporaryAssignment",
  PROJECT_REQUIREMENT: "ProjectRequirement",
  OTHER: "Other"
});

const FetchAdminDetailsReasons = Object.freeze({
  SUPPORT_REQUEST: "SupportRequest",                     // Audit-safe
  SECURITY_INVESTIGATION: "SecurityInvestigation",
  COMPLIANCE_AUDIT: "ComplianceAudit",
  USER_COMPLAINT: "UserComplaint",
  PAYMENT_ISSUE: "PaymentIssue",
  ADMIN_OVERSIGHT: "AdminOversight",
  OTHER: "Other"
});

const FetchUserDetailsReasons = Object.values({
  SUPPORT_REQUEST: "support_request",
  SECURITY_INVESTIGATION: "security_investigation",
  COMPLIANCE_AUDIT: "compliance_audit",
  USER_COMPLAINT: "user_complaint",
  PAYMENT_ISSUE: "payment_issue",
  ADMIN_OVERSIGHT: "admin_oversight",
  OTHER: "other"
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
  MISTAKE: "mistake",
  OTHER: "other"
});

const ActivationReasons = Object.freeze({
  REINSTATEMENT_AFTER_REVIEW: "reinstatement_after_review",
  TEMPORARY_SUSPENSION_ENDED: "temporary_suspension_ended",
  APPEAL_APPROVED: "appeal_approved",
  ADMINISTRATIVE_DECISION: "administrative_decision",
  SYSTEM_ERROR_CORRECTION: "system_error_correction",
  OTHER: "other"
});

const DeactivationReasons = Object.freeze({
  POLICY_VIOLATION: "policy_violation",
  MISCONDUCT: "misconduct",
  SECURITY_CONCERN: "security_concern",
  RESIGNED: "resigned",
  TERMINATED: "terminated",
  TEMPORARY_SUSPENSION: "temporary_suspension",
  INACTIVITY: "inactivity",
  OTHER: "other"
});

const AuthLogCheckReasons = Object.freeze({
  SECURITY_INVESTIGATION: "security_investigation",
  SUSPICIOUS_ACTIVITY_REPORTED: "suspicious_activity_reported",
  ACCOUNT_COMPROMISE_SUSPECTED: "account_compromise_suspected",
  USER_SUPPORT_REQUEST: "user_support_request",
  AUDIT_COMPLIANCE: "audit_compliance",
  FAILED_LOGIN_INVESTIGATION: "failed_login_investigation",
  OTHER: "other"
});

const RequestReviewReasons = Object.freeze({
  APPROVED_AS_VALID: "approved_as_valid",
  REJECTED_INSUFFICIENT_JUSTIFICATION: "rejected_insufficient_justification",
  REJECTED_POLICY_VIOLATION: "rejected_policy_violation",
  APPROVED_WITH_CONDITIONS: "approved_with_conditions",
  REJECTED_DUPLICATE_REQUEST: "rejected_duplicate_request",
  APPROVED_EMERGENCY: "approved_emergency",
  OTHER: "other"
});

const UserAccountDetailsReasons = Object.freeze({
  SUPPORT_REQUEST: "support_request",
  ACCOUNT_VERIFICATION: "account_verification",
  SECURITY_INVESTIGATION: "security_investigation",
  COMPLIANCE_AUDIT: "compliance_audit",
  USER_COMPLAINT: "user_complaint",
  PAYMENT_ISSUE: "payment_issue",
  OTHER: "other"
});

const UserActiveDevicesReasons = Object.freeze({
  SECURITY_CHECK: "security_check",
  SUSPICIOUS_ACTIVITY: "suspicious_activity",
  USER_REPORTED_UNAUTHORIZED: "user_reported_unauthorized",
  SUPPORT_REQUEST: "support_request",
  COMPLIANCE_AUDIT: "compliance_audit",
  DEVICE_LIMIT_EXCEEDED: "device_limit_exceeded",
  OTHER: "other"
});

const UpdateAdminDetailsReasons = Object.freeze({
  CONTACT_INFO_UPDATE: "contact_info_update",
  ROLE_CHANGE: "role_change",
  ERROR_CORRECTION: "error_correction",
  ADMIN_REQUEST: "admin_request",
  COMPLIANCE_UPDATE: "compliance_update",
  REORGANIZATION: "reorganization",
  OTHER: "other"
});

const AdminType = Object.freeze({
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  MID_ADMIN: "mid_admin"
});

// Role Hierarchy: Higher numeric value = Higher authority
// An admin can ONLY act on roles with STRICTLY LOWER hierarchy values
const RoleHierarchy = Object.freeze({
  [AdminType.SUPER_ADMIN]: 3,
  [AdminType.MID_ADMIN]: 2,
  [AdminType.ADMIN]: 1
});

const DeviceType = Object.freeze({
  MOBILE: "mobile",
  TABLET: "tablet",
  LAPTOP: "laptop"
});

const PerformedBy = Object.freeze({
  ADMIN: "admin",
  SYSTEM: "system",
  MID_ADMIN: "mid_admin",
  SUPER_ADMIN: "super_admin"
});

const AuthModes = Object.freeze({
  EMAIL: "email",
  PHONE: "phone",
  BOTH: "both",
  EITHER: "either"
});

const Roles = Object.freeze({
  ...AdminType,
  USER: "user"
});

const ServiceName = Object.freeze({
  AUTH_SERVICE: "AuthService",
  ADMIN_PANEL_SERVICE: "AdminPanelService",
});

const Status = Object.freeze({
  SUCCESS: "success",
  FAILURE: "failure",
  PENDING: "pending"
});

const ChangeSupervisorReasons = Object.freeze({
  REORGANIZATION: "reorganization",
  PERFORMANCE_ISSUES: "performance_issues",
  PERSONAL_REQUEST: "personal_request",
  ADMIN_REQUEST: "admin_request",
  OTHER: "other"
});

const ViewActivityTrackerReasons = Object.freeze({
  SECURITY_AUDIT: "security_audit",
  COMPLIANCE_CHECK: "compliance_check",
  SUSPICIOUS_ACTIVITY_INVESTIGATION: "suspicious_activity_investigation",
  PERIODIC_REVIEW: "periodic_review",
  INCIDENT_INVESTIGATION: "incident_investigation",
  PERFORMANCE_MONITORING: "performance_monitoring",
  ADMIN_OVERSIGHT: "admin_oversight",
  SUPPORT_REQUEST: "support_request",
  OTHER: "other"
});

const IdentifierKeys = Object.freeze({
  email: {
    User: ["userId", "email"],
    Admin: ["adminId", "email"]
  },
  phone: {
    User: ["userId", "fullPhoneNumber"],
    Admin: ["adminId", "fullPhoneNumber"]
  },
  both: {
    User: ["userId", "email", "fullPhoneNumber"],
    Admin: ["adminId", "email", "fullPhoneNumber"]
  },
  either: {
    User: ["userId", "email", "fullPhoneNumber"],
    Admin: ["adminId", "email", "fullPhoneNumber"]
  }
});

const AuditMode = Object.freeze({
  FULL: "FULL",
  CHANGED_ONLY: "CHANGED_ONLY"
})

const requestType = Object.freeze({
  DEACTIVATION: "deactivation",
  ACTIVATION: "activation"
});

const requestStatus = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
});

const viewScope = Object.freeze({
  ALL: "ALL",
  ADMINS_ONLY: "ADMINS_ONLY",
  SELF_ONLY: "SELF_ONLY"
});

const BlockDeviceReasons = Object.freeze({
  SUSPICIOUS_ACTIVITY: "suspicious_activity",
  COMPROMISED_DEVICE: "compromised_device",
  UNAUTHORIZED_ACCESS: "unauthorized_access",
  SECURITY_THREAT: "security_threat",
  USER_REQUESTED: "user_requested",
  MALWARE_DETECTED: "malware_detected",
  OTHER: "other"
});

const UnblockDeviceReasons = Object.freeze({
  VERIFIED_SAFE: "verified_safe",
  USER_VERIFIED: "user_verified",
  FALSE_POSITIVE: "false_positive",
  DEVICE_SECURED: "device_secured",
  USER_REQUESTED: "user_requested",
  SECURITY_CHECK_PASSED: "security_check_passed",
  OTHER: "other"
});

module.exports = {
  BlockReasons,         // snake_case values → DB/API
  UnblockReasons,
  ActivationReasons,    // For admin activation operations
  DeactivationReasons,  // For admin deactivation operations
  AuthLogCheckReasons,  // For checking authentication logs
  RequestReviewReasons, // For approving/rejecting status requests
  UserAccountDetailsReasons, // For viewing user account details
  UserActiveDevicesReasons,  // For viewing user active devices
  UpdateAdminDetailsReasons, // For updating admin details
  ViewActivityTrackerReasons, // For viewing activity tracker
  AdminType,
  RoleHierarchy,
  DeviceType,
  PerformedBy,
  AuthModes,
  Roles,
  ServiceName,
  Status,
  IdentifierKeys,
  AuditMode,
  requestType,
  requestStatus,
  viewScope,
  ChangeSupervisorReasons,
  BlockDeviceReasons,
  UnblockDeviceReasons,
  AdminCreationReasons,
  AdminUpdateRoleReasons,
  FetchAdminDetailsReasons,
  FetchUserDetailsReasons
};
