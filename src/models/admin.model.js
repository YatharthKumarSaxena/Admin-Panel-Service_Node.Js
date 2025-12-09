const mongoose = require("mongoose");
const { fullPhoneNumberLength, emailLength } = require("../configs/fields-length.config");
const { AuthModes, AdminType, PerformedBy } = require("../configs/enums.config")
const { emailRegex, fullPhoneNumberRegex, customIdRegex } = require("../configs/regex.config");

/* Admin Schema */

/*
 * Admin_ID
 * Email_ID
 * createdBy
 * isActive
 * userType
 * supervisorID
 * updatedBy
*/

// Defined Document Structure of a Admin
const adminSchema = mongoose.Schema({
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
    adminId: {
        type: String,
        unique: true,
        immutable: true,
        match: customIdRegex,
        index: true // Perfect for performance in token-based auth.
    },
    emailId: {
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
    isActive: {
        type: Boolean,
        default: true
    },
    adminType: {
        type: String,
        enum: Object.values(AdminType),
        default: AdminType.ADMIN
    },
    supervisorId: {
        type: String,
        default: null,
        validate: {
            validator: function (value) {
                // If adminType is ADMIN or MID_ADMIN, supervisorId must not be null
                if ([AdminType.ADMIN, AdminType.MID_ADMIN].includes(this.adminType)) {
                    return value !== null;
                }
                return true; // SUPER_ADMIN can have null
            },
            message: `supervisorId is required for ${AdminType.ADMIN} and ${AdminType.MID_ADMIN} users.`
        }
    },
    createdBy: {
        type: String,
        required: true,
        default: PerformedBy.SYSTEM  // For SUPER_ADMIN Creation
    },
    updatedBy: {
        type: String,
        default: null
    }
}, { timestamps: true, versionKey: false });

adminSchema.index({ emailId: 1 }, { unique: true, sparse: true });
adminSchema.index({ fullPhoneNumber: 1 }, { unique: true, sparse: true });

// Creating a Collection named Admins that will Include Admin Documents / Records
// module.exports convert the whole file into a Module
module.exports = {
    AdminModel: mongoose.model("Admin", adminSchema)
}
// By Default Mongoose Convert Admin into Plural Form i.e Admins