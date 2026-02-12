const mongoose = require("mongoose");
const { BaseRequestModel } = require("./base-request.model");
const { requestType, requestStatus, AdminTypes } = require("@configs/enums.config");
const { BlockPermissionReasons, SpecialPermissionReasons } = require("@configs/reasons.config");
const { AllPermissions } = require("@configs/rbac-permissions.config");
const { adminIdRegex } = require("@/configs/regex.config");

/**
 * 🔐 Permission Request Discriminator
 * Extends BaseRequest for permission grant/revoke workflows
 * 
 * Handles:
 * - Special permission grants
 * - Permission revocations
 * - Temporary permission overrides
 * - Maker-checker pattern for sensitive permissions
 */

const permissionRequestSchema = new mongoose.Schema({
  // 🎫 Permission Details
  permission: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return AllPermissions.includes(v);
      },
      message: props => `${props.value} is not a valid permission code`
    }
  },

  // ⏱️ Expiration (for temporary grants)
  expiresAt: {
    type: Date,
    default: null
  },

  // 🔗 Override Reference (links to special_permissions or blocked_permissions collection)
  overrideId: {
    type: String,
    default: null
  }
});

// Override reason validation to match request type
permissionRequestSchema.path('reason').validate(function (value) {
  if (this.requestType === requestType.PERMISSION_GRANT) {
    return Object.values(SpecialPermissionReasons).includes(value);
  } else if (this.requestType === requestType.PERMISSION_REVOKE) {
    return Object.values(BlockPermissionReasons).includes(value);
  }
  return false;
}, 'Invalid reason for permission request type');

// 🔐 Type-Specific Indexes
permissionRequestSchema.index({ targetId: 1, permission: 1 });
permissionRequestSchema.index({ permission: 1, status: 1 });

// Prevent duplicate pending permission requests for same admin+permission+type
permissionRequestSchema.index(
  { targetId: 1, permission: 1, requestType: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: requestStatus.PENDING,
      requestType: {
        $in: [requestType.PERMISSION_GRANT, requestType.PERMISSION_REVOKE]
      }
    }
  }
);

// 🛡️ Permission Request Specific Validation
permissionRequestSchema.pre("validate", function (next) {
  // Ensure requestType is either PERMISSION_GRANT or PERMISSION_REVOKE
  if (![requestType.PERMISSION_GRANT, requestType.PERMISSION_REVOKE].includes(this.requestType)) {
    return next(new Error("Permission request type must be PERMISSION_GRANT or PERMISSION_REVOKE."));
  }

  // Validate approved requests have overrideId
  if (this.status === requestStatus.APPROVED && !this.overrideId) {
    return next(new Error("Approved permission requests must have overrideId."));
  }

  if (
    this.requestType === requestType.PERMISSION_GRANT &&
    this.expiresAt &&
    this.expiresAt <= new Date()
  ) {
    return next(
      new Error("expiresAt must be a future date.")
    );
  }

  if (this.requestedBy === this.targetId) {
    return next(
      new Error("Self permission override not allowed.")
    );
  }
  
  if (this.targetType === AdminTypes.INTERNAL_ADMIN) {
    return next(
      new Error("Permission requests does not apply to internal admins.")
    );
  }

  // target must be adminId
  if (!adminIdRegex.test(this.targetId)) {
    return next(
      new Error(
        "targetId must be a valid adminId."
      )
    );
  }

  // requestedBy must be adminId
  if (!adminIdRegex.test(this.requestedBy)) {
    return next(
      new Error(
        "requestedBy must be a valid adminId."
      )
    );
  }

  // Prevent self override
  if (this.requestedBy === this.targetId) {
    return next(
      new Error(
        "Self permission override not allowed."
      )
    );
  }
  next();
});

// 📊 Static Methods
permissionRequestSchema.statics.findPendingGrants = function () {
  return this.find({
    requestType: requestType.PERMISSION_GRANT,
    status: requestStatus.PENDING
  }).sort({ createdAt: -1 });
};

permissionRequestSchema.statics.findPendingRevokes = function () {
  return this.find({
    requestType: requestType.PERMISSION_REVOKE,
    status: requestStatus.PENDING
  }).sort({ createdAt: -1 });
};

permissionRequestSchema.statics.findByPermission = function (permission) {
  return this.find({ permission }).sort({ createdAt: -1 });
};

// Create discriminator for PERMISSION_GRANT
const PermissionGrantRequestModel = BaseRequestModel.discriminator(
  requestType.PERMISSION_GRANT,
  permissionRequestSchema
);

// Create discriminator for PERMISSION_REVOKE (shares same schema)
const PermissionRevokeRequestModel = BaseRequestModel.discriminator(
  requestType.PERMISSION_REVOKE,
  permissionRequestSchema.clone()
);

module.exports = {
  PermissionGrantRequestModel,
  PermissionRevokeRequestModel
};
