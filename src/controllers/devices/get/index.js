const { viewDeviceDetails } = require("./get-device-details.controller");
const { listDevices } = require("./list-devices.controller");

const getControllers = {
    listDevices,
    viewDeviceDetails
}

module.exports = {
    getControllers
}