const mongoose = require("mongoose");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AuthModes, DeviceType, PerformedBy } = require("@configs/enums.config");
const { emailRegex, fullPhoneNumberRegex } = require("@configs/regex.config");
const { fullPhoneNumberLength, emailLength } = require("@configs/fields-length.config");

const activityTrackerSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    index: true
  },

  adminDetails: {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      minlength: emailLength.min,
      maxlength: emailLength.max,
      match: emailRegex
    },
    fullPhoneNumber: {
      type: String,
      trim: true,
      index: true,
      minlength: fullPhoneNumberLength.min,
      maxlength: fullPhoneNumberLength.max,
      match: fullPhoneNumberRegex
    },
    _id: false
  },

  eventType: {
    type: String,
    enum: Object.values(ACTIVITY_TRACKER_EVENTS),
    required: true
  },

  deviceId: {
    type: String,
    required: true
  },

  deviceName: {
    type: String,
    default: null
  },

  deviceType: {
    type: String,
    enum: Object.values(DeviceType),
    default: null
  },

  performedBy: {
    type: String,
    enum: Object.values(PerformedBy),
    default: PerformedBy.ADMIN
  },

  description: {
    type: String,
    required: true
  },

  oldData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  newData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  adminActions: {
    type: new mongoose.Schema({
      targetUserId: {
        type: String,
        default: null
      },
      targetUserDetails: {
        email: {
          type: String,
          lowercase: true,
          trim: true,
          minlength: emailLength.min,
          maxlength: emailLength.max,
          match: emailRegex,
          default: null
        },
        fullPhoneNumber: {
          type: String,
          trim: true,
          minlength: fullPhoneNumberLength.min,
          maxlength: fullPhoneNumberLength.max,
          match: fullPhoneNumberRegex,
          default: null
        },
        default: null,
        _id: false
      },
      reason: {
        type: String,
        default: null
      },
      filter: {
        type: [String],
        validate: {
          validator: function (arr) {
            return arr.every(item => ACTIVITY_TRACKER_EVENTS.includes(item));
          },
          message: 'Filter must contain valid ACTIVITY_TRACKER_EVENTS'
        },
        default: undefined
      }
    },
      { _id: false }),
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

// 🔐 Conditional validator for adminDetails based on DEFAULT_AUTH_MODE
activityTrackerSchema.path("adminDetails").validate(function (v) {
  const mode = process.env.DEFAULT_AUTH_MODE;
  const hasEmail = !!v?.email;
  const hasPhone = !!v?.fullPhoneNumber;

  if (mode === AuthModes.EMAIL) return hasEmail;
  if (mode === AuthModes.PHONE) return hasPhone;
  if (mode === AuthModes.BOTH) return hasEmail && hasPhone;
  if (mode === AuthModes.EITHER) return (hasEmail ^ hasPhone);

  return true;
}, "adminDetails must include required fields based on DEFAULT_AUTH_MODE");

activityTrackerSchema.path("adminActions.targetUserDetails").validate(function (v) {
  const mode = process.env.DEFAULT_AUTH_MODE;
  const hasEmail = !!v?.email;
  const hasPhone = !!v?.fullPhoneNumber;

  if (mode === AuthModes.EMAIL) return hasEmail;
  if (mode === AuthModes.PHONE) return hasPhone;
  if (mode === AuthModes.BOTH) return hasEmail && hasPhone;
  if (mode === AuthModes.EITHER) return (hasEmail && !hasPhone) || (!hasEmail && hasPhone); // XOR → exactly one

  return true;
}, "targetUserDetails must include required fields based on DEFAULT_AUTH_MODE");

module.exports = {
  ActivityTrackerModel: mongoose.model("ActivityTracker", activityTrackerSchema)
}
