const { authServiceControllers } = require("./auth-service/index")

const internalControllers = {
    ...authServiceControllers
};

module.exports = {
  internalControllers
};
