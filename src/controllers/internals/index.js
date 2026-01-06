const { listAuthLogs } = require("./list-auth-logs");
const { blockDevice } = require("./block-device.controller");
const { unblockDevice } = require("./unblock-device.controller");
const { checkAuthLogs } = require("./check-auth-logs.controller");
const { getUserActiveDevices } = require("./get-user-active-devices.controller");
const { provideUserAccountDetails } = require("./provide-user-account-details.controller");

const internalControllers = {
  listAuthLogs,
  blockDevice,
  unblockDevice,
  checkAuthLogs,
  getUserActiveDevices,
  provideUserAccountDetails
};

module.exports = {
  internalControllers
};
