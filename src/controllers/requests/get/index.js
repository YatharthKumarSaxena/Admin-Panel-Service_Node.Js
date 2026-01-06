const { viewStatusRequest } = require("./view-status-request.controller");
const { listAllStatusRequests } = require("./list-all-status-requests.controller");

const getControllers = {
    viewStatusRequest,
    listAllStatusRequests
}

module.exports = {
    getControllers
}