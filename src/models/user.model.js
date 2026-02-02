const mongoose = require("mongoose");
const { firstNameLength, reasonFieldLength } = require("@configs/fields-length.config");
const { BlockReasons, UnblockReasons, FirstNameFieldSetting } = require("@configs/enums.config");
const { firstNameRegex, userIdRegex, adminIdRegex } = require("@configs/regex.config");
const { FIRST_NAME_SETTING } = require("@configs/security.config");

/* User Schema */
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        immutable: true,
        match: userIdRegex,
        index: true
    },
    firstName: {
        type: String,
        trim: true,
        minlength: firstNameLength.min,
        maxlength: firstNameLength.max,
        match: firstNameRegex
    },
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, enum: Object.values(BlockReasons), default: null },
    blockedBy: { type: String, default: null, match: adminIdRegex },
    blockReasonDetails: { type: String, minlength: reasonFieldLength.min, maxlength: reasonFieldLength.max, default: null },
    blockCount: { type: Number, default: 0 },
    unblockReason: { type: String, enum: Object.values(UnblockReasons), default: null },
    unblockReasonDetails: { type: String, minlength: reasonFieldLength.min, maxlength: reasonFieldLength.max, default: null },
    unblockedBy: { type: String, default: null, match: adminIdRegex },
    unblockCount: { type: Number, default: 0 },
    blockedAt: { type: Date, default: null },
    unblockedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

/* 🔐 Conditional Validator */
userSchema.pre("validate", function (next) {

    // 1. FirstName Field Validation
    if (
        FIRST_NAME_SETTING === FirstNameFieldSetting.DISABLED &&
        this.firstName != null
    ) {
        this.invalidate(
            "firstName",
            "First Name field is disabled and must not be provided."
        );
    }

    else if (FIRST_NAME_SETTING === FirstNameFieldSetting.MANDATORY) {
        if (!this.firstName || (typeof this.firstName === 'string' && this.firstName.trim().length === 0)) {
            this.invalidate("firstName", "First Name is required as per configuration.");
        }
    }

    // 2. Block/Unblock Validation
    if (this.isBlocked) {
        if (!this.blockReason || !this.blockedBy) {
            return next(new Error("Blocked users must have blockReason and blockedBy."));
        }
    } else {
        if (this.unblockReason && !this.unblockedBy) {
            return next(new Error("Unblocked users must have unblockedBy when unblockReason is set."));
        }
    }
    next();
});

userSchema.pre("save", function (next) {
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

// Creating a Collection named Users that will Include User Documents / Records
// module.exports convert the whole file into a Module
module.exports = {
    UserModel: mongoose.model("User", userSchema)
};
// By Default Mongoose Convert User into Plural Form i.e Users