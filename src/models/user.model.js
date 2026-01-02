const mongoose = require("mongoose");
const { fullPhoneNumberLength, emailLength } = require("@configs/fields-length.config");
const { AuthModes, BlockReasons, UnblockReasons, BlockVia, UnblockVia } = require("@configs/enums.config");
const { emailRegex, fullPhoneNumberRegex } = require("@configs/regex.config");

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
    blockedBy: { type: String, default: null },
    blockReasonDetails: { type: String, maxlength: 1000, default: null },
    blockedVia: { type: String, enum: Object.values(BlockVia), default: null },
    blockCount: { type: Number, default: 0 },
    unblockReason: { type: String, enum: Object.values(UnblockReasons), default: null },
    unblockReasonDetails: { type: String, maxlength: 1000, default: null },
    unblockedBy: { type: String, default: null },
    unblockedVia: { type: String, enum: Object.values(UnblockVia), default: null },
    unblockCount: { type: Number, default: 0 },
    blockedAt: { type: Date, default: null },
    unblockedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

/* 🔐 Conditional AuthMode Validator */
userSchema.pre("validate", function (next) {
    const mode = process.env.DEFAULT_AUTH_MODE;
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
    next();
});

// Creating a Collection named Users that will Include User Documents / Records
// module.exports convert the whole file into a Module
module.exports = {
    UserModel: mongoose.model("User", userSchema)
};
// By Default Mongoose Convert User into Plural Form i.e Users