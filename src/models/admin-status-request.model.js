const mongoose = require("mongoose");
const { adminIdRegex } = require("@configs/regex.config");
const { requestType, requestStatus } = require("@configs/enums.config");
const { reasonFieldLength, notesFieldLength } = require("@/configs/fields-length.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");

/**
 * Admin Status Request Schema
 * Handles both activation and deactivation requests with approval workflow
 */

const adminStatusRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  requestType: {
    type: String,
    enum: Object.values(requestType),
    required: true
  },
  requestedBy: {
    type: String,
    required: true,
    match: adminIdRegex,
    index: true
  },
  targetAdminId: {
    type: String,
    required: true,
    match: adminIdRegex,
    index: true
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    minlength: reasonFieldLength.min,
    maxlength: reasonFieldLength.max
  },
  notes: {
    type: String,
    trim: true,
    minlength: notesFieldLength.min,
    maxlength: notesFieldLength.max,
    default: null
  },
  status: {
    type: String,
    enum: Object.values(requestStatus),
    default: requestStatus.PENDING,
    index: true
  },
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: true,
  collection: "admin_status_requests"
});

// Indexes for efficient queries
adminStatusRequestSchema.index({ requestType: 1, status: 1 });
adminStatusRequestSchema.index({ targetAdminId: 1, status: 1 });
adminStatusRequestSchema.index({ createdAt: -1 });

// Prevent duplicate pending requests
adminStatusRequestSchema.index(
  { targetAdminId: 1, requestType: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: requestStatus.PENDING }
  }
);

const AdminStatusRequestModel = mongoose.model(DB_COLLECTIONS.ADMIN_STATUS_REQUESTS, adminStatusRequestSchema);

module.exports = { AdminStatusRequestModel };
