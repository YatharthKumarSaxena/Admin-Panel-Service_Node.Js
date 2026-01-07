const { blockUser } = require("./block-user.controller");
const { unblockUser } = require("./unblock-user.controller");

const updateControllers = {
    blockUser,
    unblockUser
};

module.exports = {
    updateControllers
}