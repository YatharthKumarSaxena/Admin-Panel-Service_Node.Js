const mongoose = require("mongoose");
const { requestIdRegex } = require("@configs/regex.config");
const { requestStatus, requestType, Roles } = require("@configs/enums.config");
const { notesFieldLength } = require("@/configs/fields-length.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");

/**
 * 🎯 Base Request Schema
 * Generic approval workflow engine for all admin requests
 * 
 * Handles:
 * - Role changes
 * - Status changes (activation/deactivation)
 * - Permission grants/revokes
 * - Client onboarding
 * 
 * Architecture: Base Schema + Mongoose Discriminators
 * Benefits:
 * - Single collection → Unified audit trail
 * - Polymorphic queries → Cross-request analytics
 * - Type-specific validation → Strong governance
 * - Reduced duplication → Maintainable codebase
 */

const baseRequestSchema = new mongoose.Schema({
  // Request Identification
  requestId: {
    type: String,
    unique: true,
    required: true,
    match: requestIdRegex,
    immutable: true,
    index: true
  },
  
  // Request Classification
  requestType: {
    type: String,
    enum: Object.values(requestType),
    required: true,
    index: true
  },
  
  // 👤 Requester Information
  requestedBy: {
    type: String,
    required: true,
    index: true
  },

  requesterType: {
    type: String,
    enum: Object.values(Roles)
  },
  
  // Target Information
  targetId: {
    type: String,
    index: true
  },

  targetType: {
    type: String,
    enum: Object.values(Roles),
    default: null
  },
  
  // 📝 Request Details
  reason: {
    type: String,
    required: true,
    trim: true
  },
  
  notes: {
    type: String,
    trim: true,
    minlength: notesFieldLength.min,
    maxlength: notesFieldLength.max,
    default: null
  },
  
  // 🔄 Approval Workflow State
  status: {
    type: String,
    enum: Object.values(requestStatus),
    default: requestStatus.PENDING,
    index: true
  },
  
  // 👨‍⚖️ Reviewer Information
  reviewedBy: {
    type: String,
    match: adminIdRegex,
    default: null
  },
  
  reviewedAt: {
    type: Date,
    default: null
  },
  
  reviewNotes: {
    type: String,
    trim: true,
    minlength: notesFieldLength.min,
    maxlength: notesFieldLength.max,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: DB_COLLECTIONS.ADMIN_REQUESTS,
  discriminatorKey: "requestType"
});

// 📊 Common Indexes (Applied to all request types)
baseRequestSchema.index({ status: 1, createdAt: -1 }); // Query pending/approved requests by time
baseRequestSchema.index({ requestedBy: 1, status: 1 }); // Track admin's requests
baseRequestSchema.index({ createdAt: -1 }); // Recent requests first

// ✅ Base Validation Hook
baseRequestSchema.pre("validate", function(next) {
  // Validate reviewed requests have reviewer info
  if ([requestStatus.APPROVED, requestStatus.REJECTED].includes(this.status)) {
    if (!this.reviewedBy || !this.reviewedAt) {
      return next(new Error("Reviewed requests must have reviewedBy and reviewedAt."));
    }
  }
  
  next();
});

// 🔍 Static Methods for Polymorphic Queries

/**
 * Get all pending requests across all types
 */
baseRequestSchema.statics.findAllPending = function() {
  return this.find({ status: requestStatus.PENDING }).sort({ createdAt: -1 });
};

/**
 * Get request count by type and status
 */
baseRequestSchema.statics.getRequestStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: { type: "$requestType", status: "$status" },
        count: { $sum: 1 }
      }
    }
  ]);
};

/**
 * Get admin's request history (as requester or reviewer)
 */
baseRequestSchema.statics.getAdminActivity = function(adminId) {
  return this.find({
    $or: [
      { requestedBy: adminId },
      { reviewedBy: adminId }
    ]
  }).sort({ createdAt: -1 });
};

const BaseRequestModel = mongoose.model(DB_COLLECTIONS.ADMIN_REQUESTS, baseRequestSchema);

module.exports = { 
  BaseRequestModel,
  baseRequestSchema 
};
