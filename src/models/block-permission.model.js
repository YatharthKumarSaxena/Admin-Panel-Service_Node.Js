const mongoose = require("mongoose");
const { notesFieldLength } = require("@configs/fields-length.config");
const { BlockPermissionReasons } = require("@configs/enums.config");
const { adminIdRegex } = require("@configs/regex.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");
const { AllPermissions } = require("@configs/rbac-permissions.config");

/** * Block Permission Model * * Stores permission blocks that override both role-based and special permissions * (DENY overrides). Has highest priority in permission resolution. * * Resolution Priority: DENY > SPECIAL_ALLOW > ROLE_ALLOW
 */

const blockPermissionSchema = new mongoose.Schema({
    adminId: {
        type: String,
        match: adminIdRegex,
        index: true,
        unique: true,
        required: true
    },
    permission: {
        type: [String],
        required: true,
        index: true,
        enum: AllPermissions
    },
    blockedBy: {
        type: String,
        match: adminIdRegex,
        required: true
    },
    reason: {
        type: String,
        enum: Object.values(BlockPermissionReasons),
        required: true
    },
    notes: {
        type: String,
        minlength: notesFieldLength.min,
        maxlength: notesFieldLength.max,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null,
        index: true
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
    lastUpdatedReason: {
        type: String,
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
blockPermissionSchema.index({ adminId: 1, permission: 1 });
blockPermissionSchema.index({ expiresAt: 1 });
blockPermissionSchema.index({ createdAt: -1 });

module.exports = {
    BlockPermissionModel: mongoose.model(DB_COLLECTIONS.BLOCKED_PERMISSIONS, blockPermissionSchema)
};
