const { createControllers } = require("./create/index");
const { updateControllers } = require("./update/index");
const { deleteControllers } = require("./delete/index");
const { getControllers } = require("./get/index");

const activityTrackerControllers = {
    ...createControllers,
    ...getControllers,
    ...updateControllers,
    ...deleteControllers
}

module.exports = {
    activityTrackerControllers
}