const cron = require("node-cron");
const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { adminCleanup } = require("@configs/cron.config");
const { errorMessage } = require("@/responses/common/error-handler.response");

const cleanDeactivatedAdmins = async () => {
	try {
		if (!adminCleanup.enable) return;

		if (!adminCleanup.deactivatedRetentionDays || adminCleanup.deactivatedRetentionDays < 1) {
			logWithTime("⚠️ Invalid retention days configuration. Skipping admin cleanup.");
			return;
		}

		const cutoffDate = new Date(Date.now() - adminCleanup.deactivatedRetentionDays * 24 * 60 * 60 * 1000);
		logWithTime("📅 [CRON-JOB] ➤ Deactivated Admins Cleanup Started...");

		// Delete admins that are not active and were last updated (or created) before cutoff
		const result = await AdminModel.deleteMany({
			isActive: false,
			updatedAt: { $lt: cutoffDate }
		});

		if (result.deletedCount === 0) {
			logWithTime(`📭 No deactivated admins eligible for deletion (older than ${adminCleanup.deactivatedRetentionDays} days).`);
		} else {
			logWithTime(`🗑️ Admins Deletion Job: ${result.deletedCount} admin(s) hard deleted (updated > ${adminCleanup.deactivatedRetentionDays} days).`);
		}
	} catch (err) {
		logWithTime("❌ Internal Error in deleting deactivated admins by Cron Job.");
		errorMessage(err);
		return;
	}
};

// Run on schedule
cron.schedule(adminCleanup.cronSchedule, cleanDeactivatedAdmins, {
	timezone: adminCleanup.timezone
});

module.exports = { cleanDeactivatedAdmins };
