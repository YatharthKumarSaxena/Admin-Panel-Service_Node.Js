const { deleteControllers } = require("./delete/index");
const { updateControllers } = require("./update/index");
const { createControllers } = require("./create/index");
const { getControllers } = require("./get/index");

const eventHandlingControllers = {
    ...createControllers,
    ...getControllers,
    ...updateControllers,
    ...deleteControllers
}

module.exports = {
    eventHandlingControllers
}