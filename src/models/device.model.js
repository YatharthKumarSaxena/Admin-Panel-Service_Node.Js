const mongoose = require("mongoose");
const { notesFieldLength, deviceNameLength } = require("@configs/fields-length.config");
const { DeviceTypes } = require("@configs/enums.config");
const { BlockDeviceReasons, UnblockDeviceReasons } = require("@configs/reasons.config");
const { adminIdRegex, UUID_V4_REGEX } = require("@configs/regex.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");

/* Device Tracker Schema */
const deviceSchema = new mongoose.Schema({
    deviceUUID: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
        match: UUID_V4_REGEX,
        index: true
    },

    deviceName: { 
        type: String, 
        required: false, 
        trim: true, 
        minlength: deviceNameLength.min, 
        maxlength: deviceNameLength.max,
        default: null
    },

    deviceType: {
        type: String,
        required: false,
        enum: Object.values(DeviceTypes),
        default: null
    },

    isVerified: { type: Boolean, default: true },

    isBlocked: { type: Boolean, default: false },

    blockReason: {
        type: String,
        enum: Object.values(BlockDeviceReasons),
        default: null
    },

    blockReasonDetails: {
        type: String,
        minlength: notesFieldLength.min,
        maxlength: notesFieldLength.max,
        default: null
    },

    blockedBy: {
        type: String,
        match: adminIdRegex,
        default: null
    },

    blockCount: { type: Number, default: 0 },

    unblockReason: {
        type: String,
        enum: Object.values(UnblockDeviceReasons),
        default: null
    },

    unblockReasonDetails: {
        type: String,
        minlength: notesFieldLength.min,
        maxlength: notesFieldLength.max,
        default: null
    },

    unblockedBy: {
        type: String,
        match: adminIdRegex,
        default: null
    },

    blockedAt: { type: Date, default: null },
    unblockedAt: { type: Date, default: null }

}, { timestamps: true, versionKey: false });

/* 🔐 Block / Unblock Integrity */
deviceSchema.pre("validate", function (next) {
    if (this.isBlocked) {
        if (!this.blockReason || !this.blockedBy) {
            return next(new Error("Blocked device must have blockReason and blockedBy."));
        }
    } else {
        if (this.unblockReason && !this.unblockedBy) {
            return next(new Error("Unblocked device must have unblockedBy when unblockReason is set."));
        }
    }
    next();
});

/* 🔁 Counters & Timestamps */
deviceSchema.pre("save", function (next) {
    if (this.isModified("isBlocked")) {
        if (this.isBlocked) {
            this.blockCount += 1;
            this.blockedAt = new Date();
        } else {
            this.unblockCount += 1;
            this.unblockedAt = new Date();
        }
    }
    next();
});

module.exports = {
    DeviceModel: mongoose.model(DB_COLLECTIONS.DEVICES, deviceSchema)
};
