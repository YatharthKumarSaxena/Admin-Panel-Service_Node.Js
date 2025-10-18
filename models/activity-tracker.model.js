const mongoose = require("mongoose");
const ACTIVITY_TRACKER_EVENTS = require("../configs/activity-tracker.config");
const { DeviceType, PerformedBy } = require("../configs/enums.config");

const activityTrackerSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        index: true
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
            reason: {
                type: String,
                default: null
            },
            filter: {
                type: [String],
                enum: ACTIVITY_TRACKER_EVENTS,
                default: undefined  // not null; avoids storing empty arrays unnecessarily
            }
        }, { _id: false }),
        default: undefined
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("ActivityTracker", activityTrackerSchema);