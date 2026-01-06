const { listAuthLogs } = require("./auth-service/data-queries/get/list-auth-logs");
const { blockDevice } = require("./auth-service/data-queries/update/block-device.controller");
const { unblockDevice } = require("./auth-service/data-queries/update/unblock-device.controller");
const { checkAuthLogs } = require("./auth-service/data-queries/get/check-auth-logs.controller");
const { getUserActiveDevices } = require("./auth-service/data-queries/get/get-user-active-devices.controller");
const { provideUserAccountDetails } = require("./auth-service/data-queries/get/provide-user-account-details.controller");

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
