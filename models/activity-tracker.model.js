const mongoose = require("mongoose");
const ACTIVITY_TRACKER_EVENTS = require("../configs/activity-tracker.config");
const { DeviceType, PerformedBy } = require("../configs/enums.config");
const { emailRegex, fullPhoneNumberRegex } = require("../configs/regex.config");
const { fullPhoneNumberLength, emailLength } = require("../configs/fields-length.config");

const activityTrackerSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        index: true
    },
    adminDetails: {
        emailID: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
            index: true,
            minlength: emailLength.min,
            maxlength: emailLength.max,
            match: emailRegex
        },
        fullPhoneNumber: {
            type: String,
            trim: true,
            required: true,
            index: true,
            minlength: fullPhoneNumberLength.min,
            maxlength: fullPhoneNumberLength.max,
            match: fullPhoneNumberRegex
        }
    },
    eventType: {
        type: String,
        enum: ACTIVITY_TRACKER_EVENTS,
        required: true
    },
    deviceID: {
        type: String,
        required: true
    },
    deviceName: {
        type: String
    },
    deviceType: {
        type: String,
        enum: Object.values(DeviceType),
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
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
            targetUserID: {
                type: String,
                default: null
            },
            targetUserDetails: {
                emailID: {
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
            },
            reason: {
                type: String,
                default: null
            },
            filter: {
                type: [String],
                enum: ACTIVITY_TRACKER_EVENTS,
                default: undefined  // not null; avoids storing empty arrays unnecessarily
            }
        }, {
            _id: false,
            validate: {
                validator: function (v) {
                    const d = v?.targetUserDetails;
                    const hasEmail = !!d?.emailID;
                    const hasPhone = !!d?.fullPhoneNumber;
                    return hasEmail === hasPhone; // both true or both false
                },
                message: "Both emailID and fullPhoneNumber must be provided together or omitted together."
            }
        }),
        default: null
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("ActivityTracker", activityTrackerSchema);