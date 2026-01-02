const { blockUser } = require("./block-user.controller");
const { unblockUser } = require("./unblock-user.controller");
const { checkAuthLogs } = require("./check-auth-logs.controller");
const { getUserActiveDevices } = require("./get-user-active-devices.controller");
const { provideUserAccountDetails } = require("./provide-user-account-details.controller");
const { getTotalRegisteredUsers } = require("./get-total-registered-users.controller");
const { listUsers } = require("./list-users.controller");

const userControllers = {
    blockUser,
    unblockUser,
    checkAuthLogs,
    getUserActiveDevices,
    provideUserAccountDetails,
    getTotalRegisteredUsers,
    listUsers
};

module.exports = { userControllers };
