// SUCCESS RESPONSES INDEX

const { adminSuccessResponses } = require("./admin.response");
const { userSuccessResponses } = require("./user.response");
const { deviceSuccessResponses } = require("./device.response");
const { requestSuccessResponses } = require("./request.response");
const { activityTrackerSuccessResponses } = require("./activity-tracker.response");
const { internalSuccessResponses } = require("./internal.response");

module.exports = {
    // Admin responses
    ...adminSuccessResponses,
    
    // User responses
    ...userSuccessResponses,
    
    // Device responses
    ...deviceSuccessResponses,
    
    // Request responses
    ...requestSuccessResponses,
    
    // Activity Tracker responses
    ...activityTrackerSuccessResponses,
    
    // Internal responses
    ...internalSuccessResponses
};
