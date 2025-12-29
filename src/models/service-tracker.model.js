const mongoose = require("mongoose");
const { Status, ServiceName } = require("@configs/enums.config");
const { SERVICE_TRACKER_EVENTS } = require("@configs/tracker.config");

const serviceTrackerSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    enum: Object.values(ServiceName)
  },
  eventType: {
    type: String,
    required: true,
    enum: Object.values(SERVICE_TRACKER_EVENTS)
  },
  status: {
    type: String,
    enum: Status,
    default: Status.SUCCESS
  },
  description: {
    type: String,
    required: true
  },
  errorDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  affectedUserId: {
    type: String,
    immutable: true,
    match: customIdRegex,
    default: null
  },
  oldData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  newData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
traceId: {
  type: String,
  index: true,
  default: null
},
originService: {
  type: String,
  enum: Object.values(ServiceName),
  required: true
}
}, {
  timestamps: true,
  versionKey: false
});

module.exports = {
  ServiceTrackerModel: mongoose.model("ServiceTracker", serviceTrackerSchema)
};
