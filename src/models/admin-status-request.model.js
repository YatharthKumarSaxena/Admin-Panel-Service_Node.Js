const mongoose = require("mongoose");
const { customIdRegex } = require("@configs/regex.config");
const { requestType } = require("@configs/enums.config");

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
    match: customIdRegex,
    index: true
  },
  targetAdminId: {
    type: String,
    required: true,
    match: customIdRegex,
    index: true
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000,
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
    match: customIdRegex,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewNotes: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
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
    partialFilterExpression: { status: "PENDING" }
  }
);

const AdminStatusRequestModel = mongoose.model("AdminStatusRequest", adminStatusRequestSchema);

module.exports = { AdminStatusRequestModel };
