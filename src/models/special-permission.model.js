const mongoose = require("mongoose");
const { notesFieldLength } = require("@configs/fields-length.config");
const { SpecialPermissionReasons } = require("@configs/enums.config");
const { adminIdRegex } = require("@configs/regex.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");
const { AllPermissions } = require("@configs/rbac-permissions.config");

/**
 * Special Permission Model
 * 
 * Stores temporary or permanent special permission grants that override
 * default role-based permissions (ALLOW overrides).
 * 
 * Resolution Priority: DENY > SPECIAL_ALLOW > ROLE_ALLOW
 */

const specialPermissionSchema = new mongoose.Schema({
    adminId: {
        type: String,
        match: adminIdRegex,
        unique: true,
        index: true,
        required: true
    },
    permission: {
        type: [String],
        required: true,
        index: true,
        enum: AllPermissions
    },
    grantedBy: {
        type: String,
        match: adminIdRegex,
        required: true
    },
    expiresAt: {
        type: Date,
        default: null,
        index: true
    },
    reason: {
        type: String,
        enum: Object.values(SpecialPermissionReasons),
        required: true
    },
    notes: {
        type: String,
        minlength: notesFieldLength.min,
        maxlength: notesFieldLength.max,
        default: null
    },
    lastUpdatedBy: {
        type: String,
        match: adminIdRegex,
        default: null
    },
    lastUpdatedAt: {
        type: Date,
        default: null
    },
    lastUpdationNotes: {
        type: String,
        minlength: notesFieldLength.min,
        maxlength: notesFieldLength.max,
        default: null
    }
}, { timestamps: true, versionKey: false });

// Compound indexes for efficient querying
specialPermissionSchema.index({ adminId: 1, permission: 1 });
specialPermissionSchema.index({ lastUpdatedAt: 1 });
specialPermissionSchema.index({ createdAt: -1 });

module.exports = {
    SpecialPermissionModel: mongoose.model(DB_COLLECTIONS.SPECIAL_PERMISSIONS, specialPermissionSchema)
};
