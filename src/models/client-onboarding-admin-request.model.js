const mongoose = require("mongoose");
const { BaseRequestModel } = require("./base-request.model");
const { requestStatus, requestType, AdminTypes, UserTypes, ClientTypes } = require("@configs/enums.config");
const { adminIdRegex, userIdRegex } = require("@/configs/regex.config");
const { ClientCreationReasons, ClientOnboardingRejectionReasons } = require("@/configs/reasons.config");
const { notesFieldLength, orgNameLength } = require("@/configs/fields-length.config");

/**
 * 🏢 Client Onboarding (Admin) Request Discriminator
 * Admin-initiated client conversion workflow
 */

const clientOnboardingAdminRequestSchema = new mongoose.Schema({

    // 🏢 Organization Details
    orgName: {
        type: String,
        required: true,
        trim: true,
        minlength: orgNameLength.min,
        maxlength: orgNameLength.max
    },

    orgSize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"],
        default: null
    },

    orgIndustry: {
        type: String,
        maxlength: 100,
        default: null
    },

    clientEntityType: {
        type: String,
        enum: Object.values(ClientTypes),
        required: true
    },

    // ❌ Rejection Details
    rejectionReason: {
        type: String,
        enum: Object.values(ClientOnboardingRejectionReasons),
        default: null
    },

    rejectionReasonDetails: {
        type: String,
        minlength: notesFieldLength.min,
        maxlength: notesFieldLength.max,
        default: null
    }

});


/* -------------------------------------------------------------------------- */
/*                        🎯 Reason Validation Override                       */
/* -------------------------------------------------------------------------- */

clientOnboardingAdminRequestSchema.path("reason").validate(function (value) {
    return Object.values(ClientCreationReasons).includes(value);
}, "Invalid client onboarding reason");

clientOnboardingAdminRequestSchema
    .path("targetId")
    .validate(function (value) {
        return userIdRegex.test(value);
    }, "targetId must be a valid userId");

/* -------------------------------------------------------------------------- */
/*                          🔐 Indexes (Corrected)                             */
/* -------------------------------------------------------------------------- */

clientOnboardingAdminRequestSchema.index(
    { requestedBy: 1, targetId: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: requestStatus.PENDING,
            requestType: requestType.CLIENT_ONBOARDING_ADMIN
        }
    }
);



/* -------------------------------------------------------------------------- */
/*                         🛡️ Governance Validation                           */
/* -------------------------------------------------------------------------- */

clientOnboardingAdminRequestSchema.pre("validate", function (next) {

    // 1️⃣ Rejection reason mandatory if rejected
    if (this.status === requestStatus.REJECTED && !this.rejectionReason) {
        return next(
            new Error("Rejected onboarding requests must have rejectionReason.")
        );
    }

    // 2️⃣ Rejection reason details mandatory if rejection reason is set
    if (
        this.status === requestStatus.REJECTED &&
        this.rejectionReason &&
        !this.rejectionReasonDetails
    ) {
        return next(
            new Error("Rejection details required for audit clarity.")
        );
    }

    // 2️⃣ Request type guard
    if (this.requestType !== requestType.CLIENT_ONBOARDING_ADMIN) {
        return next(
            new Error("Request type must be CLIENT_ONBOARDING_ADMIN.")
        );
    }

    // 3️⃣ Requester must be ADMIN
    if (this.requesterType !== AdminTypes.INTERNAL_ADMIN) {
        return next(
            new Error("Only Internal Admin can raise admin onboarding requests.")
        );
    }

    // 4️⃣ requesterId must match adminId regex
    if (!adminIdRegex.test(this.requestedBy)) {
        return next(
            new Error("requestedBy must be a valid adminId for admin onboarding.")
        );
    }

    if (this.targetType !== UserTypes.USER) {
        return next(
            new Error("Admin onboarding target must be of type USER.")
        );
    }

    if (this.clientEntityType === ClientTypes.ORGANIZATION) {
        if (!this.orgName) {
            return next(
                new Error("Organization name required for org clients.")
            );
        }
    }

    if (this.clientEntityType !== ClientTypes.ORGANIZATION) {
        this.orgName = null;
        this.orgSize = null;
        this.orgIndustry = null;
    }
    
    if (this.status === requestStatus.REJECTED) {

        if (!this.rejectionReason) {
            return next(
                new Error("Rejection reason required.")
            );
        }

        if (!this.rejectionReasonDetails) {
            return next(
                new Error("Rejection details required for audit clarity.")
            );
        }
    }

    next();
});


/* -------------------------------------------------------------------------- */
/*                             📊 Static Methods                               */
/* -------------------------------------------------------------------------- */

clientOnboardingAdminRequestSchema.statics.findPendingOnboardings =
    function () {
        return this.find({
            status: requestStatus.PENDING
        }).sort({ createdAt: -1 });
    };


clientOnboardingAdminRequestSchema.statics.findByRequester =
    function (adminId) {
        return this.find({
            requestedBy: adminId
        }).sort({ createdAt: -1 });
    };


clientOnboardingAdminRequestSchema.statics.findByOrgName =
    function (orgName) {
        return this.find({
            orgName: new RegExp(orgName, "i")
        }).sort({ createdAt: -1 });
    };


/* -------------------------------------------------------------------------- */
/*                         🎭 Discriminator Mapping                            */
/* -------------------------------------------------------------------------- */

const ClientOnboardingAdminRequestModel =
    BaseRequestModel.discriminator(
        requestType.CLIENT_ONBOARDING_ADMIN,
        clientOnboardingAdminRequestSchema
    );

module.exports = {
    ClientOnboardingAdminRequestModel
};
