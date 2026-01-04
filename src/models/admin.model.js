const mongoose = require("mongoose");
const { fullPhoneNumberLength, emailLength } = require("@configs/fields-length.config");
const { AuthModes, AdminType, ActivationReasons, DeactivationReasons } = require("@configs/enums.config");
const { emailRegex, fullPhoneNumberRegex, adminIdRegex } = require("@configs/regex.config");

/* Admin Schema */
const adminSchema = new mongoose.Schema({
    fullPhoneNumber: {
        type: String,
        trim: true,
        match: fullPhoneNumberRegex,
        minlength: fullPhoneNumberLength.min,
        maxlength: fullPhoneNumberLength.max,
        default: null,
        index: true,
        unique: true,
        sparse: true
    },
    adminId: {
        type: String,
        unique: true,
        immutable: true,
        match: adminIdRegex,
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        minlength: emailLength.min,
        maxlength: emailLength.max,
        match: emailRegex,
        default: null,
        index: true,
        unique: true,
        sparse: true
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
        match: adminIdRegex,
        default: null
    },
    createdBy: {
        type: String,
        default: null,
        match: adminIdRegex
    },
    updatedBy: {
        type: String,
        match: adminIdRegex,
        default: null
    },
    activatedBy: {
        type: String,
        match: adminIdRegex,
        default: null
    },
    deactivatedBy: {
        type: String,
        match: adminIdRegex,
        default: null
    },
    activatedReason: {
        type: String,
        default: null,
        enum: ActivationReasons
    },
    deactivatedReason: {
        type: String,
        default: null,
        enum: DeactivationReasons
    }
}, { timestamps: true, versionKey: false });

/* 🔐 Centralized Validation Hook */
adminSchema.pre("validate", function (next) {
    const mode = process.env.AUTH_MODE;

    // 1. Auth Mode Validation
    const hasEmail = this.email && this.email.length > 0;
    const hasPhone = this.fullPhoneNumber && this.fullPhoneNumber.length > 0;

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

    // 2. Supervisor Validation (Dependent on AdminType) 
    if ([AdminType.ADMIN, AdminType.MID_ADMIN].includes(this.adminType)) {
        if (!this.supervisorId) {
            return next(new Error(`supervisorId is required for ${this.adminType} users.`));
        }
    }
    
    // 3. createdBy Validation (Dependent on AdminType) 
    if (this.adminType === AdminType.SUPER_ADMIN) {
        if (this.createdBy !== null && this.createdBy !== "SYSTEM") {
            return next(new Error("SUPER_ADMIN must have createdBy as null or 'SYSTEM'."));
        }
    } else {
        if (!this.createdBy) {
            return next(new Error(`${this.adminType} must have a valid createdBy adminId.`));
        }
    }
    next();
});

module.exports = {
    AdminModel: mongoose.model("Admin", adminSchema)
};
