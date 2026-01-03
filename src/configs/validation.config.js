const { 
  fullPhoneNumberRegex, 
  emailRegex, 
  UUID_V4_REGEX, 
  mongoIdRegex, 
  customIdRegex 
} = require("./regex.config");

const { 
  emailLength, 
  fullPhoneNumberLength,
  deviceNameLength,
  reasonFieldLength,
  notesFieldLength,
  customIdLength,
  mongoIdLength
} = require("./fields-length.config");

const {
  AdminTypeHelper,
  StatusHelper,
  AdminStatusHelper,
  BlockReasonHelper,
  UnblockReasonHelper,
  DeactivateReasonHelper,
  DeviceTypeHelper,
  PerformedByHelper
} = require("@utils/enum-validators.util");

/**
 * 🎯 Centralized Field Validation Rules
 * 
 * Key = field name in request body
 * Value = validation rules to apply
 * 
 * Rules:
 * - length: { min, max } - String length validation
 * - regex: RegExp - Pattern matching validation
 * - enum: EnumHelper - Enum value validation
 * - required: boolean - Is field mandatory? (default: true)
 * - message: string - Custom error message
 * 
 * Auto-detection:
 * - If `length` exists → validates string length
 * - If `regex` exists → validates pattern match
 * - If `enum` exists → validates against enum values
 * - If `required: false` → skips validation if field not provided
 * 
 * @example
 * // Field with multiple validations
 * email: {
 *   length: emailLength,     // Min/max length check
 *   regex: emailRegex,       // Format validation
 *   required: true           // Mandatory field
 * }
 * 
 * @example
 * // Enum validation only
 * adminType: {
 *   enum: AdminTypeHelper,   // Must be valid enum value
 *   required: true
 * }
 */
const validationRules = {
  // ========================================
  // 🔹 Authentication Fields
  // ========================================
  email: {
    length: emailLength,
    regex: emailRegex,
    required: true,
    message: "Invalid email format"
  },
  fullPhoneNumber: {
    length: fullPhoneNumberLength,
    regex: fullPhoneNumberRegex,
    required: true,
    message: "Phone number must be in E.164 format (e.g., +923001234567)"
  },
  
  // ========================================
  // 🔹 Device Fields
  // ========================================
  deviceId: {
    regex: UUID_V4_REGEX,
    required: true,
    message: "Device ID must be a valid UUID v4"
  },
  deviceName: {
    length: deviceNameLength,
    required: false
  },
  deviceType: {
    enum: DeviceTypeHelper,
    required: false
  },
  
  // ========================================
  // 🔹 Admin Fields
  // ========================================
  adminId: {
    length: customIdLength,
    regex: customIdRegex,
    required: true,
    message: "Admin ID must be in format: ADM0000001"
  },
  adminType: {
    enum: AdminTypeHelper,
    required: true
  },
  status: {
    enum: StatusHelper,
    required: false
  },
  adminStatus: {
    enum: AdminStatusHelper,
    required: false
  },
  
  // ========================================
  // 🔹 MongoDB Object ID
  // ========================================
  _id: {
    length: mongoIdLength,
    regex: mongoIdRegex,
    required: true,
    message: "Invalid MongoDB ObjectID format"
  },
  id: {
    length: mongoIdLength,
    regex: mongoIdRegex,
    required: true,
    message: "Invalid ID format"
  },
  
  // ========================================
  // 🔹 Action Reason Fields
  // ========================================
  reason: {
    length: reasonFieldLength,
    required: true
  },
  notes: {
    length: { min: 0, max: notesFieldLength.max },
    required: false
  },
  blockReason: {
    enum: BlockReasonHelper,
    required: true
  },
  unblockReason: {
    enum: UnblockReasonHelper,
    required: true
  },
  deactivateReason: {
    enum: DeactivateReasonHelper,
    required: true
  },
  performedBy: {
    enum: PerformedByHelper,
    required: true
  },
  
  // ========================================
  // 🔹 Supervisor Management
  // ========================================
  newSupervisorId: {
    length: customIdLength,
    regex: customIdRegex,
    required: true,
    message: "Supervisor ID must be in format: ADM0000001"
  },
  oldSupervisorId: {
    length: customIdLength,
    regex: customIdRegex,
    required: false,
    message: "Old Supervisor ID must be in format: ADM0000001"
  }
};

/**
 * 🎯 Pre-defined Validation Sets for Common Routes
 * Use these for quick setup of common validation patterns
 * 
 * @example
 * router.post('/create-admin',
 *   validateFields(validationSets.createAdmin),
 *   createAdminController
 * );
 */
const validationSets = {
  // Admin Management
  createAdmin: ['email', 'adminType'],
  updateAdmin: ['email'],
  deleteAdmin: ['email', 'reason'],
  
  // Admin Status Operations
  activateAdmin: ['reason'],
  deactivateAdmin: ['reason', 'deactivateReason'],
  blockAdmin: ['reason', 'blockReason'],
  unblockAdmin: ['reason', 'unblockReason'],
  
  // Supervisor Management
  changeSupervisor: ['newSupervisorId', 'reason'],
  
  // User Operations
  blockUser: ['blockReason', 'notes', 'performedBy'],
  unblockUser: ['unblockReason', 'notes', 'performedBy'],
  blockDevice: ['reason'],
  unblockDevice: ['reason'],
  
  // Device Verification
  verifyDevice: ['deviceId']
};

module.exports = {
  validationRules,
  validationSets
};
