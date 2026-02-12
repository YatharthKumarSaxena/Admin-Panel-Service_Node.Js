const mongoose = require("mongoose");
const { firstNameLength } = require("@configs/fields-length.config");
const { AdminTypes, ActivationReasons, DeactivationReasons, FirstNameFieldSetting } = require("@configs/enums.config");
const { firstNameRegex, adminIdRegex } = require("@configs/regex.config");
const { FIRST_NAME_SETTING } = require("@configs/security.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");

/* Admin Schema */
const adminSchema = new mongoose.Schema({
    adminId: {
        type: String,
        unique: true,
        immutable: true,
        match: adminIdRegex,
        index: true
    },
    firstName: {
        type: String,
        trim: true,
        minlength: firstNameLength.min,
        maxlength: firstNameLength.max,
        match: firstNameRegex
    },
    isActive: {
        type: Boolean,
        default: true
    },
    adminType: {
        type: String,
        enum: Object.values(AdminTypes),
        default: AdminTypes.INTERNAL_ADMIN
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

    // 2. Supervisor Validation (Dependent on AdminType) 
    // All roles except SUPER_ADMIN require a supervisor
    if (this.adminType !== AdminTypes.SUPER_ADMIN) {
        if (!this.supervisorId) {
            return next(new Error(`supervisorId is required for ${this.adminType} admins.`));
        }
    }
    
    // 3. createdBy Validation (Dependent on AdminType) 
    if (this.adminType === AdminTypes.SUPER_ADMIN) {
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
    AdminModel: mongoose.model(DB_COLLECTIONS.ADMINS, adminSchema)
};
