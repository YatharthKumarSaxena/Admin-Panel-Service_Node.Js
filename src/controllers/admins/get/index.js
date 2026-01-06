const { listAdmins } = require("./list-admins.controller");
const { viewAdminDetails } = require("./view-admin-details.controller");
const { viewOwnAdminDetails } = require("./view-own-admin-details.controller");

const getControllers = {
    listAdmins,
    viewAdminDetails,
    viewOwnAdminDetails
}

module.exports = {
    getControllers
}