const {ADMIN_BASE, USER_BASE, INTERNAL_BASE } = require("@configs/uri.config");
const { adminRoutes } = require("./admins.routes");

module.exports = (app) => {
  app.use(ADMIN_BASE, adminRoutes);
//  app.use(USER_BASE, userRoutes);
//  app.use(INTERNAL_BASE, internalRoutes); 
};