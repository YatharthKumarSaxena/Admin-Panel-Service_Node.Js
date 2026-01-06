const { listAuthLogs } = require("./list-auth-logs");
const { checkAuthLogs } = require("./check-auth-logs.controller");
const { getUserActiveDevices } = require("./get-user-active-devices.controller");
const { provideUserAccountDetails } = require("./provide-user-account-details.controller");

const getControllers = {
    listAuthLogs,
    checkAuthLogs,
    getUserActiveDevices,
    provideUserAccountDetails
}

module.exports = {
    getControllers
}