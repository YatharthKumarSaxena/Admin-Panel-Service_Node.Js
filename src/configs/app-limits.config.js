const { getMyEnvAsNumber } = require("@/utils/env.util");

module.exports = {
  adminRegistrationCapacity: getMyEnvAsNumber('ADMIN_REGISTRATION_CAPACITY', 100),
  totalRequestCapacity: getMyEnvAsNumber('REQUEST_DATA_CAPACITY', 1000),
  userRegistrationCapacity: getMyEnvAsNumber('USER_REGISTRATION_CAPACITY', 100)
};
