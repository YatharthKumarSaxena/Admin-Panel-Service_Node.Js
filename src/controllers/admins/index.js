const { deleteControllers } = require("./delete/index");
const { updateControllers } = require("./update/index");
const { createControllers } = require("./create/index");
const { getControllers } = require("./get/index");

const adminControllers = {
    ...createControllers,
    ...getControllers,
    ...updateControllers,
    ...deleteControllers
}

module.exports = {
    adminControllers
}