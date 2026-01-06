const { dataQueryControllers } = require("./data-queries/index");
const { eventHandlingControllers } = require("./event-handling/index"); 

const authServiceControllers = {
    ...dataQueryControllers,
    ...eventHandlingControllers
}

module.exports = {
    authServiceControllers
}