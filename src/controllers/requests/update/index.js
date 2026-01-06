const { approveDeactivationRequest } = require("./approve-deactivation-request.controller");
const { rejectDeactivationRequest } = require("./reject-deactivation-request.controller");
const { approveActivationRequest } = require("./approve-activation-request.controller");
const { rejectActivationRequest } = require("./reject-activation-request.controller");

const updateControllers = {
    approveDeactivationRequest,
    rejectDeactivationRequest,
    approveActivationRequest,
    rejectActivationRequest
}

module.exports = {
    updateControllers
}