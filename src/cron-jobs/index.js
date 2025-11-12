// Require cron job files to ensure they are scheduled when this module is loaded
require("./cleanup-activity-tracker.cron.js");
require("./cleanup-deactivated-admins.cron.js");
