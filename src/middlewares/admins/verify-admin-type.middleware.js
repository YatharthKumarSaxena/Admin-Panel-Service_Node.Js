const { AdminType } = require("@configs/enums.config");
const { createRoleMiddleware } = require("../factory/role-based-access.middleware-factory");

const RoleMiddlewares = {
  onlyAdmins: createRoleMiddleware([AdminType.ADMIN], "onlyAdmins"),
  onlySuperAdmins: createRoleMiddleware([AdminType.SUPER_ADMIN], "onlySuperAdmins"),
  onlyMidAdmins: createRoleMiddleware([AdminType.MID_ADMIN], "onlyMidAdmins"),
  adminsAndMidAdmins: createRoleMiddleware([AdminType.ADMIN, AdminType.MID_ADMIN], "adminsAndMidAdmins"),
  midAdminsAndSuperAdmins: createRoleMiddleware([AdminType.MID_ADMIN, AdminType.SUPER_ADMIN], "midAdminsAndSuperAdmins")
};

module.exports = { RoleMiddlewares };
