const mongoose = require("mongoose");
const { fullPhoneNumberLength, emailLength, reasonFieldLength } = require("@configs/fields-length.config");
const { AuthModes, BlockReasons, UnblockReasons } = require("@configs/enums.config");
const { emailRegex, fullPhoneNumberRegex, userIdRegex, adminIdRegex } = require("@configs/regex.config");

/* User Schema */
const userSchema = new mongoose.Schema({
    fullPhoneNumber: {
        type: String,
        trim: true,
        match: fullPhoneNumberRegex,
        minlength: fullPhoneNumberLength.min,
        maxlength: fullPhoneNumberLength.max,
        index: true,
        unique: true,
        sparse: true,
        default: null
    },
    userId: {
        type: String,
        unique: true,
        immutable: true,
        match: userIdRegex,
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        minlength: emailLength.min,
        maxlength: emailLength.max,
        match: emailRegex,
        index: true,
        unique: true,
        sparse: true,
        default: null
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

/* 🔐 Conditional AuthMode Validator */
userSchema.pre("validate", function (next) {
    const mode = process.env.AUTH_MODE;
    const hasEmail = !!this.email;
    const hasPhone = !!this.fullPhoneNumber;

    if (mode === AuthModes.EMAIL && !hasEmail) {
        return next(new Error("Email is required in EMAIL mode."));
    }
    if (mode === AuthModes.PHONE && !hasPhone) {
        return next(new Error("Phone number is required in PHONE mode."));
    }
    if (mode === AuthModes.BOTH && (!hasEmail || !hasPhone)) {
        return next(new Error("Both email and phone are required in BOTH mode."));
    }
    if (mode === AuthModes.EITHER) {
        if (!hasEmail && !hasPhone) {
            return next(new Error("Either email or phone is required in EITHER mode."));
        }
        if (hasEmail && hasPhone) {
            return next(new Error("Provide only one identifier (email OR phone) in EITHER mode."));
        }
    }
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