const { blockDevice } = require("./block-device.controller");
const { unblockDevice } = require("./unblock-device.controller");

const updateControllers = {
    blockDevice,
    unblockDevice
}
 
module.exports = {
    updateControllers
}