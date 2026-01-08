const { createControllers } = require("./create/index");
const { getControllers } = require("./get/index");
const { updateControllers } = require("./update/index");
const { deleteControllers } = require("./delete/index");

const deviceControllers = {
    ...createControllers,
    ...getControllers,
    ...updateControllers,
    ...deleteControllers
}

module.exports = {
  deviceControllers
};