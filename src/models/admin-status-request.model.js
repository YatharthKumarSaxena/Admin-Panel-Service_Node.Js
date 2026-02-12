const mongoose = require("mongoose");
const { BaseRequestModel } = require("./base-request.model");
const { requestType, requestStatus, AdminTypes } = require("@configs/enums.config");
const { reasonFieldLength } = require("@/configs/fields-length.config");
const { adminIdRegex } = require("@/configs/regex.config");

/**
 * 🚦 Admin Status Request Discriminator
 * Extends BaseRequest for admin activation/deactivation workflows
 * 
 * Handles:
 * - Admin activation requests
 * - Admin deactivation requests
 * - Suspension workflows
 * - Reactivation approvals
 */

const adminStatusRequestSchema = new mongoose.Schema({
  // Status requests don't need additional fields beyond base
  // requestType differentiates ACTIVATION vs DEACTIVATION
});

// Override reason validation to enforce length constraints
adminStatusRequestSchema.path('reason').validate(function(value) {
  if (!value || value.trim().length < reasonFieldLength.min) {
    throw new Error(`Reason must be at least ${reasonFieldLength.min} characters`);
  }
  if (value.length > reasonFieldLength.max) {
    throw new Error(`Reason must not exceed ${reasonFieldLength.max} characters`);
  }
  return true;
}, 'Invalid reason length');

// 🔐 Type-Specific Indexes
adminStatusRequestSchema.index({ targetId: 1, status: 1 });

// Prevent duplicate pending requests for same admin and request type
adminStatusRequestSchema.index(
  { targetId: 1, requestType: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { 
      status: requestStatus.PENDING,
      requestType: { 
        $in: [requestType.ACTIVATION, requestType.DEACTIVATION] 
      }
    }
  }
);

adminStatusRequestSchema.pre("validate", function(next) {

  // Request type guard
  if (![requestType.ACTIVATION, requestType.DEACTIVATION]
        .includes(this.requestType)) {
    return next(new Error(
      "Admin status request type must be ACTIVATION or DEACTIVATION."
    ));
  }

  // Target must be admin
  if (!adminIdRegex.test(this.targetId)) {
    return next(new Error("Target must be a valid adminId."));
  }

  // Requester must be admin
  if (!adminIdRegex.test(this.requestedBy)) {
    return next(new Error("Only admins can raise admin status requests."));
  }

  // Prevent self status change
  if (this.requestedBy === this.targetId) {
    return next(new Error(
      "Admins cannot change their own status."
    ));
  }

  next();
});


// 📊 Static Methods
adminStatusRequestSchema.statics.findPendingActivations = function() {
  return this.find({
    requestType: requestType.ACTIVATION,
    status: requestStatus.PENDING
  }).sort({ createdAt: -1 });
};

adminStatusRequestSchema.statics.findPendingDeactivations = function() {
  return this.find({
    requestType: requestType.DEACTIVATION,
    status: requestStatus.PENDING
  }).sort({ createdAt: -1 });
};

// Create discriminator for ACTIVATION
const AdminActivationRequestModel = BaseRequestModel.discriminator(
  requestType.ACTIVATION,
  adminStatusRequestSchema
);

// Create discriminator for DEACTIVATION (shares same schema)
const AdminDeactivationRequestModel = BaseRequestModel.discriminator(
  requestType.DEACTIVATION,
  adminStatusRequestSchema.clone()
);

module.exports = { 
  AdminActivationRequestModel,
  AdminDeactivationRequestModel,
  // Backward compatibility
  AdminStatusRequestModel: AdminActivationRequestModel
};
