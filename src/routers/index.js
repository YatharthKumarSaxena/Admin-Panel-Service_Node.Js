const {ADMIN_BASE, USER_BASE, INTERNAL_BASE, REQUEST_BASE, ACTIVITY_TRACKING_BASE } = require("@configs/uri.config");

const { adminRoutes } = require("./admins.routes");
const { userRoutes } = require("./users.routes");
const { internalRoutes } = require("./internals.routes");
const { requestRoutes } = require("./requests.routes");
const { activityTrackerRoutes } = require("./activity-tracker.routes")

module.exports = (app) => {
  app.use(ADMIN_BASE, adminRoutes);
  app.use(USER_BASE, userRoutes);
  app.use(INTERNAL_BASE, internalRoutes);
  app.use(REQUEST_BASE, requestRoutes);
  app.use(ACTIVITY_TRACKING_BASE, activityTrackerRoutes);
};