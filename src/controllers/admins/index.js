const { createAdmin } = require("./create-admin.controller");
const { bulkAdminCreate } = require("./create-admins-in-bulk.controller");

const adminControllers = {
    createAdmin,
    bulkAdminCreate
}

module.exports = {
    adminControllers
}