const { ActivityTrackerModel } = require("@models/activity-tracker.model");
const { logWithTime } = require("./time-stamps.util");
const { errorMessage } = require("@utils/error-handler.util");
const { validateLength, isValidRegex } = require("./validators-factory.util");
const { emailRegex, fullPhoneNumberRegex } = require("@configs/regex.config");
const { emailLength, fullPhoneNumberLength } = require("@configs/fields-length.config");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AuthModes, PerformedBy } = require("@configs/enums.config");

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

      // 2. Prepare Admin Details based on Auth Mode
      const AuthMode = process.env.DEFAULT_AUTH_MODE || AuthModes.BOTH;
      const adminDetails = {
        adminId: admin.adminId  // ✅ Always include adminId in adminDetails
      };
      
      // Data Cleaning
      const rawEmail = admin.email ? admin.email.trim().toLowerCase() : null;
      const rawPhone = admin.fullPhoneNumber ? admin.fullPhoneNumber.trim() : null;

      // Validation Helper to avoid repetitive code
      const isEmailValid = (e) => e && validateLength(e, emailLength.min, emailLength.max) && isValidRegex(e, emailRegex);
      const isPhoneValid = (p) => p && validateLength(p, fullPhoneNumberLength.min, fullPhoneNumberLength.max) && isValidRegex(p, fullPhoneNumberRegex);

      // --- Admin Details Validation Logic ---
      if (AuthMode === AuthModes.EMAIL) {
        if (!isEmailValid(rawEmail)) {
          logWithTime("⚠️ Invalid email (EMAIL mode). Skipping.");
          return;
        }
        adminDetails.email = rawEmail;
      } 
      else if (AuthMode === AuthModes.PHONE) {
        if (!isPhoneValid(rawPhone)) {
          logWithTime("⚠️ Invalid phone (PHONE mode). Skipping.");
          return;
        }
        adminDetails.fullPhoneNumber = rawPhone;
      } 
      else if (AuthMode === AuthModes.BOTH) {
        if (!isEmailValid(rawEmail) || !isPhoneValid(rawPhone)) {
          logWithTime("⚠️ Invalid email/phone (BOTH mode). Skipping.");
          return;
        }
        adminDetails.email = rawEmail;
        adminDetails.fullPhoneNumber = rawPhone;
      } 
      else if (AuthMode === AuthModes.EITHER) {
        // Schema logic says (hasEmail ^ hasPhone) -> XOR. One must exist, not both.
        // Priority: If valid email exists, use it. Else if valid phone, use it.
        if (isEmailValid(rawEmail)) {
          adminDetails.email = rawEmail;
        } else if (isPhoneValid(rawPhone)) {
          adminDetails.fullPhoneNumber = rawPhone;
        } else {
          logWithTime("⚠️ No valid email or phone (EITHER mode). Skipping.");
          return;
        }
      }

      // 3. Prepare Target User Details (if present)
      // Fix: Previous code forced BOTH email and phone. Now we follow AuthMode.
      let targetUserDetails = null;
      const targetDetailsRaw = logOptions.adminActions?.targetUserDetails || logOptions.performedOn?.details;

      if (targetDetailsRaw) {
        const tEmail = targetDetailsRaw.email;
        const tPhone = targetDetailsRaw.fullPhoneNumber;
        const tDetails = {};
        let isValidTarget = false;

        // Apply same validation logic as Admin
        if (AuthMode === AuthModes.EMAIL) {
          if (isEmailValid(tEmail)) { tDetails.email = tEmail; isValidTarget = true; }
        } 
        else if (AuthMode === AuthModes.PHONE) {
          if (isPhoneValid(tPhone)) { tDetails.fullPhoneNumber = tPhone; isValidTarget = true; }
        } 
        else if (AuthMode === AuthModes.BOTH) {
          if (isEmailValid(tEmail) && isPhoneValid(tPhone)) {
             tDetails.email = tEmail; 
             tDetails.fullPhoneNumber = tPhone; 
             isValidTarget = true; 
          }
        } 
        else if (AuthMode === AuthModes.EITHER) {
            // Priority to Email, prevent sending both to satisfy XOR schema validation
            if (isEmailValid(tEmail)) {
                tDetails.email = tEmail; 
                isValidTarget = true;
            } else if (isPhoneValid(tPhone)) {
                tDetails.fullPhoneNumber = tPhone;
                isValidTarget = true;
            }
        }

        if (isValidTarget) targetUserDetails = tDetails;
      }

      // 4. Construct Admin Actions Object
      const adminActions = {};
      
      const targetUserId = logOptions.adminActions?.targetUserId || logOptions.performedOn?.userId;
      if (targetUserId) adminActions.targetUserId = targetUserId;
      
      if (targetUserDetails) adminActions.targetUserDetails = targetUserDetails;

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