const { ActivityTrackerModel } = require("@models/activity-tracker.model");
const { logWithTime } = require("./time-stamps.util");
const { errorMessage } = require("@/responses/common/error-handler.response");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { PerformedBy } = require("@configs/enums.config");

/**
 * 🔐 Logs an activity tracker event (fire-and-forget)
 */
const logActivityTrackerEvent = async (req, eventType, logOptions = {}) => {
    try {
      // 1. Validate Event Type
      const validEvents = Object.values(ACTIVITY_TRACKER_EVENTS);
      if (!validEvents.includes(eventType)) {
        logWithTime(`⚠️ Invalid eventType: ${eventType}. Skipping activity log.`);
        return;
      }

      const admin = req.admin || req.foundAdmin || null;
      if (!admin || !admin.adminId) {
        logWithTime("⚠️ Missing admin information. Skipping activity log.");
        return;
      }

      // 2. Prepare Admin Details
      const adminDetails = {
        adminId: admin.adminId
      };

      // 3. Construct Admin Actions Object
      const adminActions = {};
      
      const targetId = logOptions.adminActions?.targetId || logOptions.performedOn?.id || logOptions.performedOn?.userId;
      if (targetId) adminActions.targetId = targetId;

      const reason = logOptions.adminActions?.reason?.trim() || req.body?.reason?.trim() || req.query?.reason?.trim();
      if (reason) adminActions.reason = reason;

      const filter = logOptions.adminActions?.filter || logOptions.filter;
      if (Array.isArray(filter)) {
        const validFilters = filter.filter(f => ACTIVITY_TRACKER_EVENTS.includes(f));
        if (validFilters.length > 0) adminActions.filter = validFilters;
      }

      // 5. Construct Final Object
      const baseLog = {
        adminId: admin.adminId,
        eventType,
        deviceId: req.deviceId, // Ensure this exists in req
        deviceName: req.deviceName || null, // Schema allows default null
        deviceType: req.deviceType || null, // Ensure strict enum match or null
        performedBy: admin.performedBy || PerformedBy.ADMIN,
        description:
          logOptions.description ||
          `Performed ${eventType} by ${admin.performedBy || PerformedBy.ADMIN}`,
        adminDetails: adminDetails,
        // Include Old/New Data
        oldData: logOptions.oldData || null,
        newData: logOptions.newData || null,
      };

      // Only add adminActions if keys exist (Schema default is null)
      if (Object.keys(adminActions).length > 0) {
        baseLog.adminActions = adminActions;
      }

      // 6. Save to DB
      const result = new ActivityTrackerModel(baseLog);
      
      await result.save();
      
      logWithTime(`📘 ActivityTracker saved: ${eventType} | Admin: ${admin.adminId}`);

    } catch (err) {
      logWithTime(`❌ Error saving ActivityTracker for event: ${eventType}`);
      // Mongoose validation errors will clearly show here now
      if(err.name === 'ValidationError') {
         logWithTime(`Validation Details: ${JSON.stringify(err.errors)}`);
      }
      errorMessage(err);
      return;
    }
};

module.exports = {
  logActivityTrackerEvent
};