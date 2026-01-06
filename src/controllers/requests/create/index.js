const { createActivationRequest } = require("./create-activation-request.controller");
const { createDeactivationRequest } = require("./create-deactivation-request.controller");

const createControllers = {
    createDeactivationRequest,
    createActivationRequest
}

module.exports = {
    createControllers
}