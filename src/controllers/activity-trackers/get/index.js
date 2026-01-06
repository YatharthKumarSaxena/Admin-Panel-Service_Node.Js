const { listActivityTracker } = require("./list-activity-tracker.controller");
const { viewAdminActivityTracker } = require("./view-admin-activity-tracker.controller");
const { viewOwnActivityTracker } = require("./view-own-activity-tracker.controller");

const getControllers = {
    listActivityTracker,
    viewAdminActivityTracker,
    viewOwnActivityTracker
}

module.exports = {
    getControllers
}