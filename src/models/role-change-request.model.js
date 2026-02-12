const mongoose = require("mongoose");
const { BaseRequestModel } = require("./base-request.model");
const { AdminTypes, requestStatus, RoleChangeReasons, requestType } = require("@configs/enums.config");
const { adminIdRegex } = require("@/configs/regex.config");

/**
 * 🎭 Role Change Request Discriminator
 * Extends BaseRequest for admin role change workflows
 * 
 * Features:
 * - Self-promotion prevention
 * - Role hierarchy validation
 * - Single-level change enforcement
 * - Maker-checker pattern for sensitive promotions
 */

const roleChangeRequestSchema = new mongoose.Schema({
  // 🔄 Role Transition
  currentRole: {
    type: String,
    enum: Object.values(AdminTypes),
    required: true
  },
  
  requestedRole: {
    type: String,
    enum: Object.values(AdminTypes),
    required: true
  }
});

// Override reason validation for role change specific reasons
roleChangeRequestSchema.path('reason').validate(function(value) {
  return Object.values(RoleChangeReasons).includes(value);
}, 'Invalid role change reason');

roleChangeRequestSchema
    .path("requestedBy")
    .validate(function (value) {
        return adminIdRegex.test(value);
    }, "requestedBy must be a valid adminId");

roleChangeRequestSchema
    .path("targetId")
    .validate(function (value) {
        return adminIdRegex.test(value);
    }, "requestedBy must be a valid adminId");
    
// 🔐 Type-Specific Indexes
roleChangeRequestSchema.index({ targetId: 1, requestedBy: 1 });

// Prevent duplicate pending role change requests for same admin
roleChangeRequestSchema.index(
  { targetId: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { 
      status: requestStatus.PENDING,
      requestType: requestType.ROLE_CHANGE
    }
  }
);

// 🛡️ Role Change Specific Validation
roleChangeRequestSchema.pre("validate", function(next) {
  // Prevent self-promotion (requestedBy should not be targetId)
  if (this.requestedBy === this.targetId) {
    return next(new Error("Self-promotion is not allowed. Role change must be requested by supervisor."));
  }
  
  // Prevent same role assignment
  if (this.currentRole === this.requestedRole) {
    return next(new Error("Current role and requested role cannot be the same."));
  }
  
  next();
});

// 📊 Static Methods
roleChangeRequestSchema.statics.findPendingForAdmin = function(adminId) {
  return this.find({
    targetId: adminId,
    status: requestStatus.PENDING
  });
};

const RoleChangeRequestModel = BaseRequestModel.discriminator(
  requestType.ROLE_CHANGE,
  roleChangeRequestSchema
);

module.exports = { RoleChangeRequestModel };
