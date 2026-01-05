const { factoryMiddlewares } = require("./factory/index");
const { adminMiddlewares } = require("./admins/index");
const { commonMiddlewares } = require("./common/index");
const { handlers } = require("./handlers/index");
const { userMiddlewares } = require("./users/index");
const { requestMiddlewares } = require("./requests/index");
const { internalMiddlewares } = require("./internals/index");

const middlewares = {
    factoryMiddlewares,
    commonMiddlewares,
    handlers,
    adminMiddlewares,
    userMiddlewares,
    requestMiddlewares,
    internalMiddlewares
}

module.exports = {
    middlewares
}