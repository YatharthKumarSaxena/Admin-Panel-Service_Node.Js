const mongoose = require("mongoose");
const { BaseRequestModel } = require("./base-request.model");
const { requestStatus, ClientCreationReasons, requestType, UserTypes } = require("@configs/enums.config");
const { userIdRegex } = require("@/configs/regex.config");

/**
 * 🏢 Client Onboarding (Self) Request Discriminator
 * Self-signup user → client conversion workflow
 */

const clientOnboardingSelfRequestSchema = new mongoose.Schema({

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

clientOnboardingSelfRequestSchema.path("reason").validate(function (value) {
  return Object.values(ClientCreationReasons).includes(value);
}, "Invalid client onboarding reason");


/* -------------------------------------------------------------------------- */
/*                          🔐 Indexes (Corrected)                             */
/* -------------------------------------------------------------------------- */

// Org search
clientOnboardingSelfRequestSchema.index({ orgName: 1 });

// Prevent duplicate pending onboarding by same requester
clientOnboardingSelfRequestSchema.index(
  { requestedBy: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: requestStatus.PENDING,
      requestType: requestType.CLIENT_ONBOARDING
    }
  }
);


/* -------------------------------------------------------------------------- */
/*                         🛡️ Governance Validation                           */
/* -------------------------------------------------------------------------- */

clientOnboardingSelfRequestSchema.pre("validate", function (next) {

  // 1️⃣ Rejection reason mandatory if rejected
  if (this.status === requestStatus.REJECTED && !this.rejectionReason) {
    return next(
      new Error("Rejected onboarding requests must have rejectionReason.")
    );
  }

  // 2️⃣ Request type guard
  if (this.requestType !== requestType.CLIENT_ONBOARDING) {
    return next(
      new Error("Request type must be CLIENT_ONBOARDING.")
    );
  }

  // 3️⃣ Requester must be USER
  if (this.requesterType !== UserTypes.USER) {
    return next(
      new Error("Self onboarding requester must be of type USER.")
    );
  }

  // 4️⃣ requesterId must match userId regex
  if (!userIdRegex.test(this.requestedBy)) {
    return next(
      new Error("requestedBy must be a valid userId for self onboarding.")
    );
  }

  next();
});


/* -------------------------------------------------------------------------- */
/*                             📊 Static Methods                               */
/* -------------------------------------------------------------------------- */

clientOnboardingSelfRequestSchema.statics.findPendingOnboardings =
function () {
  return this.find({
    status: requestStatus.PENDING
  }).sort({ createdAt: -1 });
};


clientOnboardingSelfRequestSchema.statics.findByRequester =
function (userId) {
  return this.find({
    requestedBy: userId
  }).sort({ createdAt: -1 });
};


clientOnboardingSelfRequestSchema.statics.findByOrgName =
function (orgName) {
  return this.find({
    orgName: new RegExp(orgName, "i")
  }).sort({ createdAt: -1 });
};


/* -------------------------------------------------------------------------- */
/*                         🎭 Discriminator Mapping                            */
/* -------------------------------------------------------------------------- */

const ClientOnboardingSelfRequestModel =
  BaseRequestModel.discriminator(
    requestType.CLIENT_ONBOARDING,
    clientOnboardingSelfRequestSchema
  );

module.exports = {
  ClientOnboardingSelfRequestModel
};
