// Require cron job files to ensure they are scheduled when this module is loaded
require("./cleanup-activity-tracker.cron.js");
require("./cleanup-deactivated-admins.cron.js");
require("./cleanup-deactivated-users.cron.js");

// Optionally export a noop object in case other modules want to reference loaded jobs
module.exports = {};
