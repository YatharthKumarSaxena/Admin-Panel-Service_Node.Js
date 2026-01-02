const { activateAdmin } = require("./activate-admin.controller");
const { createAdmin } = require("./create-admin.controller");
const { bulkAdminCreate } = require("./create-admins-in-bulk.controller");
const { deactivateAdmin } = require("./deactivate-admin.controller");
const { updateAdminDetails } = require("./update-admin-details.controller");
const { updateOwnAdminDetails } = require("./update-own-admin-details.controller");
const { viewAdminDetails } = require("./view-admin-details.controller");
const { viewOwnAdminDetails } = require("./view-own-admin-details.controller");
const { listAdmins } = require("./list-admins.controller");

// Status Request Controllers
const { createDeactivationRequest } = require("./create-deactivation-request.controller");
const { listDeactivationRequests } = require("./list-deactivation-requests.controller");
const { approveDeactivationRequest } = require("./approve-deactivation-request.controller");
const { rejectDeactivationRequest } = require("./reject-deactivation-request.controller");

const { createActivationRequest } = require("./create-activation-request.controller");
const { listActivationRequests } = require("./list-activation-requests.controller");
const { approveActivationRequest } = require("./approve-activation-request.controller");
const { rejectActivationRequest } = require("./reject-activation-request.controller");

const { viewStatusRequest } = require("./view-status-request.controller");

const adminControllers = {
    createAdmin,
    bulkAdminCreate,
    activateAdmin,
    deactivateAdmin,
    updateAdminDetails,
    viewAdminDetails,
    viewOwnAdminDetails,
    listAdmins,
    updateOwnAdminDetails,
    
    // Status Requests
    createDeactivationRequest,
    listDeactivationRequests,
    approveDeactivationRequest,
    rejectDeactivationRequest,
    createActivationRequest,
    listActivationRequests,
    approveActivationRequest,
    rejectActivationRequest,
    viewStatusRequest
}

module.exports = {
    adminControllers
}