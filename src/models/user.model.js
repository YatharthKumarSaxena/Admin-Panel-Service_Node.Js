const mongoose = require("mongoose");
const { firstNameLength, notesFieldLength } = require("@configs/fields-length.config");
const { FirstNameFieldSetting, UserTypes, ClientStatus } = require("@configs/enums.config");
const { BlockUserReasons, UnblockUserReasons, ClientRevertReasons } = require("@configs/reasons.config");
const { firstNameRegex, userIdRegex, adminIdRegex } = require("@configs/regex.config");
const { FIRST_NAME_SETTING } = require("@configs/security.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");

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
    userType: {
        type: String,
        enum: Object.values(UserTypes),
        default: UserTypes.USER,
        index: true
    },
    clientStatus: {
        type: String,
        enum: Object.values(ClientStatus),
        default: null,
        index: true
    },
    convertedToClientBy: {
        type: String,
        default: null,
        match: adminIdRegex
    },
    convertedToClientAt: {
        type: Date,
        default: null
    },
    clientRevertReason: {
        type: String,
        enum: Object.values(ClientRevertReasons),
        default: null
    },
    clientRevertReasonDetails: {
        type: String,
        minlength: notesFieldLength.min,
        maxlength: notesFieldLength.max,
        default: null
    },
    clientRevertedBy: {
        type: String,
        default: null,
        match: adminIdRegex
    },
    clientRevertedAt: {
        type: Date,
        default: null
    },
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, enum: Object.values(BlockUserReasons), default: null },
    blockedBy: { type: String, default: null, match: adminIdRegex },
    blockReasonDetails: { type: String, minlength: notesFieldLength.min, maxlength: notesFieldLength.max, default: null },
    blockCount: { type: Number, default: 0 },
    unblockReason: { type: String, enum: Object.values(UnblockUserReasons), default: null },
    unblockReasonDetails: { type: String, minlength: notesFieldLength.min, maxlength: notesFieldLength.max, default: null },
    unblockedBy: { type: String, default: null, match: adminIdRegex },
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

    // 3. Client Status Validation
    if (this.userType === UserTypes.CLIENT) {
        if (!this.clientStatus) {
            return next(new Error("Client users must have a clientStatus."));
        }
        if (!this.convertedToClientBy || !this.convertedToClientAt) {
            return next(new Error("Client users must have convertedToClientBy and convertedToClientAt."));
        }
    } else {
        if (this.clientStatus) {
            return next(new Error("Only CLIENT userType can have clientStatus."));
        }
    }

    if (this.isBlocked && !this.blockedAt) {
        this.blockedAt = new Date();
    }

    if (!this.isBlocked && this.unblockReason && !this.unblockedAt) {
        this.unblockedAt = new Date();
    }

    if (this.clientRevertReason && !this.convertedToClientAt) {
        return next(new Error(
            "Cannot revert a user who was never converted to client."
        ));
    }

    if (this.userType !== UserTypes.CLIENT) {
        this.clientStatus = null;
    }

    next();
});

userSchema.pre("save", function (next) {
    if (this.isModified("isBlocked")) {
        if (this.isBlocked) {
            this.blockCount += 1;
            this.blockedAt = new Date();
        } else {
            this.unblockedAt = new Date();
        }
    }
    next();
});

// Creating a Collection named Users that will Include User Documents / Records
// module.exports convert the whole file into a Module
module.exports = {
    UserModel: mongoose.model(DB_COLLECTIONS.USERS, userSchema)
};
// By Default Mongoose Convert User into Plural Form i.e Users