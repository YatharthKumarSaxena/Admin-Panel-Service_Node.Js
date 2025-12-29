const { AdminType } = require("@configs/enums.config");
const { createRoleMiddleware } = require("../factory/role-based-access.middleware-factory");

const RoleMiddlewares = {
  onlyAdmins: createRoleMiddleware([AdminType.ADMIN], "onlyAdminsMiddleware"),
  onlySuperAdmins: createRoleMiddleware([AdminType.SUPER_ADMIN], "onlySuperAdminsMiddleware"),
  onlyMidAdmins: createRoleMiddleware([AdminType.MID_ADMIN], "onlyMidAdminsMiddleware"),
  adminsAndMidAdmins: createRoleMiddleware([AdminType.ADMIN, AdminType.MID_ADMIN], "adminsAndMidAdminsMiddleware"),
  midAdminsAndSuperAdmins: createRoleMiddleware([AdminType.MID_ADMIN, AdminType.SUPER_ADMIN], "midAdminsAndSuperAdminsMiddleware")
};

module.exports = { RoleMiddlewares };
