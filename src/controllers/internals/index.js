const { listAuthLogs } = require("./list-auth-logs");
const { blockDevice } = require("./block-device.controller");
const { unblockDevice } = require("./unblock-device.controller");

const internalControllers = {
  listAuthLogs,
  blockDevice,
  unblockDevice
};

module.exports = {
  internalControllers
};
