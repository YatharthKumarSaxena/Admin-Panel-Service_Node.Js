const mongoose = require("mongoose");
const { BaseRequestModel } = require("./base-request.model");
const { requestStatus, ClientCreationReasons, requestType, AdminTypes, UserTypes } = require("@configs/enums.config");
const { adminIdRegex, userIdRegex } = require("@/configs/regex.config");

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
        minlength: 2,
        maxlength: 200
    },

    orgSize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
        default: null
    },

    orgIndustry: {
        type: String,
        maxlength: 100,
        default: null
    },

    // ❌ Rejection Details
    rejectionReason: {
        type: String,
        maxlength: 500,
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
