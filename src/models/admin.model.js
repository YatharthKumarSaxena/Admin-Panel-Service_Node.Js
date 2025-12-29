const mongoose = require("mongoose");
const { fullPhoneNumberLength, emailLength } = require("@configs/fields-length.config");
const { AuthModes, AdminType, PerformedBy } = require("@configs/enums.config");
const { emailRegex, fullPhoneNumberRegex, customIdRegex } = require("@configs/regex.config");

/* Admin Schema */

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
        index: true
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
                if ([AdminType.ADMIN, AdminType.MID_ADMIN].includes(this.adminType)) {
                    return value !== null;
                }
                return true;
            },
            message: `supervisorId is required for ${AdminType.ADMIN} and ${AdminType.MID_ADMIN} users.`
        }
    },
    createdBy: {
        type: String,
        required: true,
        default: PerformedBy.SYSTEM
    },
    updatedBy: {
        type: String,
        default: null
    }
}, { timestamps: true, versionKey: false });

/* Indexes */
adminSchema.index({ email: 1 }, { unique: true, sparse: true });
adminSchema.index({ fullPhoneNumber: 1 }, { unique: true, sparse: true });

/* Mutual Exclusivity Validator for EITHER Mode */
adminSchema.pre("validate", function (next) {
    const mode = process.env.DEFAULT_AUTH_MODE;

    if (mode === AuthModes.EITHER) {
        if (!this.email && !this.fullPhoneNumber) {
            return next(new Error("Either email or fullPhoneNumber is required in EITHER mode."));
        }
        if (this.email && this.fullPhoneNumber) {
            return next(new Error("Provide only one identifier (email OR fullPhoneNumber) in EITHER mode."));
        }
    }
    next();
});

module.exports = {
    AdminModel: mongoose.model("Admin", adminSchema)
};
