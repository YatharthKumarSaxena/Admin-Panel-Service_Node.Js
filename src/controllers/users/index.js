const { createControllers } = require("./create/index");
const { updateControllers } = require("./update/index");
const { deleteControllers } = require("./delete/index");
const { getControllers } = require("./get/index");

const userControllers = {
    ...createControllers,
    ...getControllers,
    ...updateControllers,
    ...deleteControllers
};

module.exports = { 
    userControllers 
};
