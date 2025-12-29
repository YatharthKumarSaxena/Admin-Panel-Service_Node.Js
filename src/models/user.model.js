const mongoose = require("mongoose");
const { fullPhoneNumberLength, emailLength } = require("@configs/fields-length.config");
const { AuthModes, BlockReasons, UnblockReasons, BlockVia, UnblockVia } = require("@configs/enums.config")
const { emailRegex, fullPhoneNumberRegex } = require("@configs/regex.config");

/* User Schema */

/*
 * User_ID
 * Email_ID
 * isBlocked
 * blockedBy
 * unblockedBy
 * blockedAt
 * unblockedAt
 * blockVia
 * unblockVia
 * blockReason
 * unblockReason
 * blockCount
 * unblockCount
*/

// Defined Document Structure of a User
const userSchema = mongoose.Schema({
    fullPhoneNumber: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        match: fullPhoneNumberRegex,
        minlength: fullPhoneNumberLength.min,
        maxlength: fullPhoneNumberLength.max,
        validate: {
            validator: function (value) {
                const mode = process.env.DEFAULT_AUTH_MODE;
                if ([AuthModes.PHONE, AuthModes.BOTH].includes(mode)) {
                    return !!value;
                }
                return true;
            },
            message: `${AuthModes.PHONE} is required for phone or ${AuthModes.BOTH} auth modes.`
        }
    },
    userId: {
        type: String,
        unique: true,
        immutable: true,
        index: true // Perfect for performance in token-based auth.
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: emailLength.min,
        maxlength: emailLength.max,
        match: emailRegex,
        validate: {
            validator: function (value) {
                const mode = process.env.DEFAULT_AUTH_MODE;
                if ([AuthModes.EMAIL, AuthModes.BOTH].includes(mode)) {
                    return !!value;
                }
                return true;
            },
            message: `${AuthModes.EMAIL} is required for email or ${AuthModes.BOTH} auth modes.`
        }
    },
    isBlocked: { // This is controlled by Admins Only
        type: Boolean,
        default: false
    },
    blockReason: {
        type: String,
        enum: Object.values(BlockReasons),
        default: null
    },
    blockedBy: {
        type: String,
        default: null
    },
    blockedVia: {
        type: String,
        enum: Object.values(BlockVia),
        default: null
    },
    blockCount: {
        type: Number,
        default: 0
    },
    unblockReason: {
        type: String,
        enum: Object.values(UnblockReasons),
        default: null
    },
    unblockedBy: {
        type: String,
        default: null
    },
    unblockedVia: {
        type: String,
        enum: Object.values(UnblockVia),
        default: null
    },
    unblockCount: {
        type: Number,
        default: 0
    },
    blockedAt: {
        type: Date,
        default: null
    },
    unblockedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true, versionKey: false });

// Creating a Collection named Users that will Include User Documents / Records
// module.exports convert the whole file into a Module
module.exports = {
    UserModel: mongoose.model("User", userSchema)
};
// By Default Mongoose Convert User into Plural Form i.e Users