// Status Request Controllers
const { createDeactivationRequest } = require("./create-deactivation-request.controller");
const { approveDeactivationRequest } = require("./approve-deactivation-request.controller");
const { rejectDeactivationRequest } = require("./reject-deactivation-request.controller");

const { createActivationRequest } = require("./create-activation-request.controller");
const { approveActivationRequest } = require("./approve-activation-request.controller");
const { rejectActivationRequest } = require("./reject-activation-request.controller");

const { viewStatusRequest } = require("./view-status-request.controller");
const { listAllStatusRequests } = require("./list-all-status-requests.controller");

const requestControllers = {
    createDeactivationRequest,
    approveDeactivationRequest,
    rejectDeactivationRequest,
    createActivationRequest,
    approveActivationRequest,
    rejectActivationRequest,
    listAllStatusRequests,
    viewStatusRequest
}

module.exports = {
    requestControllers
}