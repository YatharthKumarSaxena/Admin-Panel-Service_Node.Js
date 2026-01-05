const { adminControllers } = require("./admins/index");
const { userControllers } = require("./users/index");
const { requestControllers } = require("./requests/index");
const { internalControllers } = require("./internals/index");
const { activityTrackerControllers } = require("./activity-trackers/index");

const controllers = {
    adminControllers,
    userControllers,
    requestControllers,
    internalControllers,
    activityTrackerControllers
}

module.exports = {
    controllers
}