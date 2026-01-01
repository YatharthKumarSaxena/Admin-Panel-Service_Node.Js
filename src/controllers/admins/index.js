const { activateAdmin } = require("./activate-admin.controller");
const { createAdmin } = require("./create-admin.controller");
const { bulkAdminCreate } = require("./create-admins-in-bulk.controller");
const { deactivateAdmin } = require("./deactivate-admin.controller");
const { submitRoleChangeRequest, rejectRoleChangeRequest, approveRoleChangeRequest } = require("./role-change-request.controller");
const { updateAdminDetails } = require("./update-admin-details.controller");
const { updateOwnAdminDetails } = require("./update-own-admin-details.controller");
const { viewAdminDetails } = require("./view-admin-details.controller");

const adminControllers = {
    createAdmin,
    bulkAdminCreate,
    activateAdmin,
    deactivateAdmin,
    updateAdminDetails,
    viewAdminDetails,
    submitRoleChangeRequest,
    rejectRoleChangeRequest,
    approveRoleChangeRequest,
    updateOwnAdminDetails
}

module.exports = {
    adminControllers
}