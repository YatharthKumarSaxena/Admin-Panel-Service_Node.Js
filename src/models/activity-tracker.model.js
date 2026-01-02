const mongoose = require("mongoose");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AuthModes, DeviceType, PerformedBy } = require("@configs/enums.config");
const { emailRegex, fullPhoneNumberRegex, customIdRegex, UUID_V4_REGEX } = require("@configs/regex.config");
const { fullPhoneNumberLength, emailLength } = require("@configs/fields-length.config");

// ✅ Validator Function (Reusable)
// Yeh function check karega ki AuthMode ke hisaab se email/phone hai ya nahi
const authModeValidator = function (v) {
  if (!v) return true; // Agar value null hai to pass hone dein (handle required elsewhere)
  
  const mode = process.env.DEFAULT_AUTH_MODE;
  const hasEmail = !!v.email;
  const hasPhone = !!v.fullPhoneNumber;

  if (mode === AuthModes.EMAIL) return hasEmail;
  if (mode === AuthModes.PHONE) return hasPhone;
  if (mode === AuthModes.BOTH) return hasEmail && hasPhone;
  if (mode === AuthModes.EITHER) return (hasEmail && !hasPhone) || (!hasEmail && hasPhone); // XOR

  return true;
};

const activityTrackerSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    match: customIdRegex,
    index: true
  },

  // ✅ FIX 1: adminDetails ko SubSchema banaya aur validator yahin laga diya
  adminDetails: {
    type: new mongoose.Schema({
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
      }
    }, { _id: false }), // _id: false taaki extra ID na bane
    required: true,
    validate: {
      validator: authModeValidator,
      message: "adminDetails must include required fields based on DEFAULT_AUTH_MODE"
    }
  },

  eventType: {
    type: String,
    enum: Object.values(ACTIVITY_TRACKER_EVENTS),
    required: true
  },

  deviceId: {
    type: String,
    required: true,
    match: UUID_V4_REGEX
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
      // ✅ FIX 2: targetUserDetails ko bhi SubSchema banaya validation ke liye
      targetUserDetails: {
        type: new mongoose.Schema({
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
          }
        }, { _id: false }),
        default: null,
        validate: {
          validator: authModeValidator,
          message: "targetUserDetails must include required fields based on DEFAULT_AUTH_MODE"
        }
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
    }, { _id: false }),
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = {
  ActivityTrackerModel: mongoose.model("ActivityTracker", activityTrackerSchema)
};