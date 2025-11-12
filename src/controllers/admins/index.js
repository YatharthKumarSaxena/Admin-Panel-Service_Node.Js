const { createAdmin } = require("./create-admin");
const { bulkAdminCreate } = require("./create-admins-in-bulk");

const adminControllers = {
    createAdmin,
    bulkAdminCreate
}

module.exports = {
    adminControllers
}