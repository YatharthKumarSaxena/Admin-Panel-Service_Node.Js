// Require cron job files to ensure they are scheduled when this module is loaded
require("./cleanup-activity-tracker.cron.js");
require("./cleanup-deactivated-admins.cron.js");
require("./cleanup-processed-requests.cron.js");

// Note: User deletion is handled by Auth Service
// This service only manages admin lifecycle and user state (block/unblock)
