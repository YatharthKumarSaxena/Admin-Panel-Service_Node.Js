const { activateAdmin } = require("./activate-admin.controller");
const { createAdmin } = require("./create-admin.controller");
const { bulkAdminCreate } = require("./create-admins-in-bulk.controller");
const { deactivateAdmin } = require("./deactivate-admin.controller");
const { changeSupervisor } = require("./change-supervisor.controller");
const { updateAdminDetails } = require("./update-admin-details.controller");
const { updateOwnAdminDetails } = require("./update-own-admin-details.controller");
const { viewAdminDetails } = require("./view-admin-details.controller");
const { viewOwnAdminDetails } = require("./view-own-admin-details.controller");
const { listAdmins } = require("./list-admins.controller");
const { updateAdminRole } = require("./update-admin-role.controller");

const adminControllers = {
    createAdmin,
    bulkAdminCreate,
    activateAdmin,
    deactivateAdmin,
    changeSupervisor,
    updateAdminDetails,
    viewAdminDetails,
    viewOwnAdminDetails,
    listAdmins,
    updateOwnAdminDetails,
    updateAdminRole
}

module.exports = {
    adminControllers
}