const { listAdmins } = require("./list-admins.controller");
const { viewAdminDetails } = require("./view-admin-details.controller");
const { viewOwnAdminDetails } = require("./view-own-admin-details.controller");
const { getAdminDashboardStats } = require("./get-total-registered-admins")

const getControllers = {
    listAdmins,
    viewAdminDetails,
    viewOwnAdminDetails,
    getAdminDashboardStats
}

module.exports = {
    getControllers
}