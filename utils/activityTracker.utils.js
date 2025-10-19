const ActivityTrackerModel = require("../models/activity-tracker.model");
const { logWithTime } = require("../utils/time-stamps.utils");
const { errorMessage, throwResourceNotFoundError } = require("../configs/error-handler.configs");

const ACTIVITY_TRACKER_EVENTS = require("../configs/activity-tracker.config");
const { DeviceType, PerformedBy } = require("../configs/enums.config");
const { emailRegex, fullPhoneNumberRegex } = require("../configs/regex.config");
const { fullPhoneNumberLength, emailLength } = require("../configs/fields-length.config");

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

      const user = req.user || req.foundUser || null;
      if (!user || !user.userID) {
        logWithTime("⚠️ Missing user information. Skipping activity log.");
        return throwResourceNotFoundError(result,);
      }
      // Extract and validate adminDetails
      const emailID =
        logOptions.adminDetails?.emailID ||
        req.user?.emailID ||
        req.foundUser?.emailID;

      const fullPhoneNumber =
        logOptions.adminDetails?.fullPhoneNumber ||
        req.user?.fullPhoneNumber ||
        req.foundUser?.fullPhoneNumber;

      const isValidEmail =
        emailRegex.test(emailID) &&
        emailID.length >= emailLength.min &&
        emailID.length <= emailLength.max;

      const isValidPhone =
        fullPhoneNumberRegex.test(fullPhoneNumber) &&
        fullPhoneNumber.length >= fullPhoneNumberLength.min &&
        fullPhoneNumber.length <= fullPhoneNumberLength.max;

      if (!isValidEmail || !isValidPhone) {
        logWithTime("⚠️ Invalid adminDetails format. Skipping activity log.");
        return;
      }

      const baseLog = {
        userID,
        eventType,
        deviceID: req.deviceID,
        performedBy,
        deviceName: req.deviceName || undefined,
        deviceType: Object.values(DeviceType).includes(req.deviceType)
          ? req.deviceType
          : undefined,
        description:
          logOptions.description ||
          req.body?.description?.trim() ||
          req.query?.description?.trim() ||
          `Performed ${eventType} by ${performedBy}`,
        adminDetails: {
          emailID,
          fullPhoneNumber
        }
      };

      // Optional adminActions block
      const adminActions = {};

      const targetUserID =
        logOptions.adminActions?.targetUserID || logOptions.performedOn?.userID;
      if (targetUserID) adminActions.targetUserID = targetUserID;

      const targetDetails =
        logOptions.adminActions?.targetUserDetails || logOptions.performedOn?.details;
      const targetEmail = targetDetails?.emailID;
      const targetPhone = targetDetails?.fullPhoneNumber;

      const hasValidTargetDetails =
        targetEmail &&
        targetPhone &&
        emailRegex.test(targetEmail) &&
        fullPhoneNumberRegex.test(targetPhone) &&
        targetEmail.length >= emailLength.min &&
        targetEmail.length <= emailLength.max &&
        targetPhone.length >= fullPhoneNumberLength.min &&
        targetPhone.length <= fullPhoneNumberLength.max;

      if (hasValidTargetDetails) {
        adminActions.targetUserDetails = {
          emailID: targetEmail,
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
      logWithTime(`📘 ActivityTracker saved: ${eventType} | user: ${userID} | device: ${req.deviceID}`);
    } catch (err) {
      logWithTime(`❌ Error saving ActivityTracker for event: ${eventType}`);
      errorMessage(err);
    }
  })();
};

module.exports = {
  logActivityTrackerEvent
};
