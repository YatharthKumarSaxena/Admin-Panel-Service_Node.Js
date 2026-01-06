const { activateAdmin } = require("./activate-admin.controller");
const { updateAdminRole } = require("./update-admin-role.controller");
const { updateAdminDetails } = require("./update-admin-details.controller");
const { changeSupervisor } = require("./change-supervisor.controller");
const { updateOwnAdminDetails } = require("./update-own-admin-details.controller");

const updateControllers = {
    activateAdmin,
    updateAdminRole,
    updateAdminDetails,
    changeSupervisor,
    updateOwnAdminDetails
}

module.exports = {
    updateControllers
}