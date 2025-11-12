const ActivityTrackerModel = require("../models/activity-tracker.model");
const { logWithTime } = require("./time-stamps.util");
const { errorMessage } = require("../configs/error-handler.configs");
const { validateEmailLength, validateEmailRegex, validatePhoneLength, validatePhoneRegex} = require("./field-validators.util");
const ACTIVITY_TRACKER_EVENTS = require("../configs/activity-tracker.config");
const { DeviceType, PerformedBy } = require("../configs/enums.config");

/**
 * 🔐 Logs an activity tracker event (fire-and-forget)
 */
const logActivityTrackerEvent = (req, eventType, logOptions = {}) => {
  (async () => {
    try {
      // Validate eventType
      if (!ACTIVITY_TRACKER_EVENTS.includes(eventType)) {
        logWithTime(`⚠️ Invalid eventType: ${eventType}. Skipping activity log.`);
        return;
      }

      const admin = req.admin || req.foundAdmin || null;
      if (!admin || !admin.adminId) {
        logWithTime("⚠️ Missing admin information. Skipping activity log.");
        return;
      }
      // Extract and validate adminDetails
      const emailId =
        logOptions.adminDetails?.emailId ||
        req.admin?.emailId ||
        req.foundAdmin?.emailId;

      const fullPhoneNumber =
        logOptions.adminDetails?.fullPhoneNumber ||
        req.admin?.fullPhoneNumber ||
        req.foundAdmin?.fullPhoneNumber;

      const isValidEmail = validateEmailLength(emailId) && validateEmailRegex(emailId);

      const isValidPhone = validatePhoneLength(fullPhoneNumber) && validatePhoneRegex(fullPhoneNumber);

      if (!isValidEmail || !isValidPhone) {
        logWithTime("⚠️ Invalid adminDetails format. Skipping activity log.");
        return;
      }

      const adminId = admin.adminId;

      const baseLog = {
        adminId,
        eventType,
        deviceId: req.deviceId,
        performedBy: req.admin.performedBy,
        deviceName: req.deviceName || undefined,
        deviceType: req.deviceType,
        description:
          logOptions.description ||
          req.body?.description?.trim() ||
          req.query?.description?.trim() ||
          `Performed ${eventType} by ${req.admin.performedBy}`,
        adminDetails: {
          emailId,
          fullPhoneNumber
        }
      };

      // Optional adminActions block
      const adminActions = {};

      const targetUserId =
        logOptions.adminActions?.targetUserId || logOptions.performedOn?.userId;
      if (targetUserId) adminActions.targetUserId = targetUserId;

      const targetDetails =
        logOptions.adminActions?.targetUserDetails || logOptions.performedOn?.details;
      const targetEmail = targetDetails?.emailID;
      const targetPhone = targetDetails?.fullPhoneNumber;

      const hasValidTargetDetails =
        targetEmail &&
        targetPhone &&
        validateEmailRegex(targetEmail) &&
        validatePhoneRegex(targetPhone) &&
        validatePhoneLength(targetPhone) &&
        validateEmailLength(targetEmail);

      if (hasValidTargetDetails) {
        adminActions.targetUserDetails = {
          emailId: targetEmail,
          fullPhoneNumber: targetPhone
        };
      }

      const reason =
        logOptions.adminActions?.reason?.trim() ||
        req.body?.reason?.trim() ||
        req.query?.reason?.trim();
      if (reason) adminActions.reason = reason;

      const filter = logOptions.adminActions?.filter || logOptions.filter;
      if (Array.isArray(filter)) {
        const validFilters = filter.filter(f => ACTIVITY_TRACKER_EVENTS.includes(f));
        if (validFilters.length > 0) adminActions.filter = validFilters;
      }

      if (Object.keys(adminActions).length > 0) {
        baseLog.adminActions = adminActions;
      }

      const result = new ActivityTrackerModel(baseLog);
      await result.save();
      logWithTime(`📘 ActivityTracker saved: ${eventType} | Admin: ${adminId} | device: ${req.deviceId}`);
    } catch (err) {
      logWithTime(`❌ Error saving ActivityTracker for event: ${eventType}`);
      errorMessage(err);
    }
  })();
};

module.exports = {
  logActivityTrackerEvent
};
