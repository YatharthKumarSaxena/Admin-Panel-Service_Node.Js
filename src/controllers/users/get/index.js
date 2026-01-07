const { getTotalRegisteredUsers } = require("./get-total-registered-users.controller");
const { listUsers } = require("./list-users.controller");
const { viewUserDetails } = require("./get-userdetails.controller");

const getControllers = {
    getTotalRegisteredUsers,
    listUsers,
    viewUserDetails
};

module.exports = {
    getControllers
}