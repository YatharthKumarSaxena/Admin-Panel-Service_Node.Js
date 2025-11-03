

const serviceTrackerSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    enum: ["AuthService", "MailService", "UserService", "CronJob", "CleanupService"]
  },
  actionType: {
    type: String,
    required: true,
    enum: ["DELETE_INACTIVE_USERS", "SEND_REMINDER_MAILS", "CLEANUP_LOGS", "SYNC_DEVICES"]
  },
  status: {
    type: String,
    enum: ["SUCCESS", "FAILURE", "PARTIAL"],
    default: "SUCCESS"
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  errorDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  affectedUserIds: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = {
  ServiceTrackerModel: mongoose.model("ServiceTracker", serviceTrackerSchema)
};
