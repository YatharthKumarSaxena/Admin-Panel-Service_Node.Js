const cron = require("node-cron");
const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { requestCleanup } = require("@configs/cron.config");
const { errorMessage } = require("@/responses/common/error-handler.response");
const { requestStatus } = require("@configs/enums.config");

/**
 * Cleanup Processed Requests Cron Job
 * Deletes approved and rejected requests that haven't been updated in X days
 * Keeps pending requests indefinitely
 */

const cleanProcessedRequests = async () => {
	try {
		if (!requestCleanup.enable) return;

		if (!requestCleanup.processedRetentionDays || requestCleanup.processedRetentionDays < 1) {
			logWithTime("⚠️ Invalid retention days configuration. Skipping request cleanup.");
			return;
		}

		const cutoffDate = new Date(Date.now() - requestCleanup.processedRetentionDays * 24 * 60 * 60 * 1000);
		logWithTime("📅 [CRON-JOB] ➤ Processed Requests Cleanup Started...");

		// Delete requests that are approved or rejected and were reviewed before cutoff
		const result = await AdminStatusRequestModel.deleteMany({
			status: { $in: [requestStatus.APPROVED, requestStatus.REJECTED] },
			reviewedAt: { $lt: cutoffDate }
		});

		if (result.deletedCount === 0) {
			logWithTime(`📭 No processed requests eligible for deletion (older than ${requestCleanup.processedRetentionDays} days).`);
		} else {
			logWithTime(`🗑️ Requests Deletion Job: ${result.deletedCount} request(s) hard deleted (processed > ${requestCleanup.processedRetentionDays} days).`);
		}
	} catch (err) {
		logWithTime("❌ Internal Error in deleting processed requests by Cron Job.");
		errorMessage(err);
		return;
	}
};

// Run on schedule
cron.schedule(requestCleanup.cronSchedule, cleanProcessedRequests, {
	timezone: requestCleanup.timezone
});

module.exports = { cleanProcessedRequests };
