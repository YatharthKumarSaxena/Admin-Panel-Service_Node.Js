const { viewAdminActivityTracker } = require("./view-admin-activity-tracker.controller");
const { listActivityTracker } = require("./list-activity-tracker.controller");
const { viewOwnActivityTracker } = require("./view-own-activity-tracker.controller");

const activityTrackerControllers = {
    viewAdminActivityTracker,
    listActivityTracker,
    viewOwnActivityTracker
}

module.exports = {
    activityTrackerControllers
}