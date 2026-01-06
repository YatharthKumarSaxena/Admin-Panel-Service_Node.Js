const { createAdmin } = require("./create-admin.controller");
const { bulkAdminCreate } = require("./create-admins-in-bulk.controller");

const createControllers = {
    createAdmin,
    bulkAdminCreate
}

module.exports = {
    createControllers
}