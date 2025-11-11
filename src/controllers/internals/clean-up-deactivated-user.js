const cron = require("node-cron");
const { UserModel } = require("../models/user.model");
const { logWithTime } = require("../utils/time-stamps.util");
const { userCleanup } = require("../configs/cron.config");
const { errorMessage } = require("../configs/error-handler.configs");

const cleanDeactivatedUsers = async () => {
	try {
		if (!userCleanup.enable) return;

		if (!userCleanup.deactivatedRetentionDays || userCleanup.deactivatedRetentionDays < 1) {
			logWithTime("⚠️ Invalid retention days configuration. Skipping user cleanup.");
			return;
		}

		const cutoffDate = new Date(Date.now() - userCleanup.deactivatedRetentionDays * 24 * 60 * 60 * 1000);
		logWithTime("📅 [CRON-JOB] ➤ Deactivated Users Cleanup Started...");

		// Delete users that are blocked (treated as deactivated here) and were last updated (or created) before cutoff
		const result = await UserModel.deleteMany({
			isBlocked: true,
			updatedAt: { $lt: cutoffDate }
		});

		if (result.deletedCount === 0) {
			logWithTime(`📭 No blocked users eligible for deletion (older than ${userCleanup.deactivatedRetentionDays} days).`);
		} else {
			logWithTime(`🗑️ Users Deletion Job: ${result.deletedCount} user(s) hard deleted (updated > ${userCleanup.deactivatedRetentionDays} days).`);
		}
	} catch (err) {
		logWithTime("❌ Internal Error in deleting blocked users by Cron Job.");
		errorMessage(err);
		return;
	}
};

// Run on schedule
cron.schedule(userCleanup.cronSchedule, cleanDeactivatedUsers, {
	timezone: userCleanup.timezone
});

module.exports = { cleanDeactivatedUsers };
