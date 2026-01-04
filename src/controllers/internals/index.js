const { cleanUpDeactivatedUser } = require("./clean-up-deactivated-user");
const { listAuthLogs } = require("./list-auth-logs");
const { blockDevice } = require("./block-device.controller");
const { unblockDevice } = require("./unblock-device.controller");

module.exports = {
  cleanUpDeactivatedUser,
  listAuthLogs,
  blockDevice,
  unblockDevice
};
