const { blockUser } = require("./update/block-user.controller");
const { unblockUser } = require("./update/unblock-user.controller");
const { getTotalRegisteredUsers } = require("./get/get-total-registered-users.controller");
const { listUsers } = require("./get/list-users.controller");

const userControllers = {
    blockUser,
    unblockUser,
    getTotalRegisteredUsers,
    listUsers
};

module.exports = { userControllers };
