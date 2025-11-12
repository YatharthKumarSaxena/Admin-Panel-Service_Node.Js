const { factoryMiddlewares } = require("./factory/index");
const { adminMiddlewares } = require("./admins/index");
const { commonMiddlewares } = require("./common/index");
const { handlers } = require("./handlers/index");

const middlewares = {
    factoryMiddlewares,
    commonMiddlewares,
    handlers,
    adminMiddlewares
}

module.exports = {
    middlewares
}