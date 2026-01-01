const { AuthModes } = require("@configs/enums.config");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * 🚀 Notification Dispatcher Utility
 * Smart dispatcher that sends Email/SMS based on AuthMode
 * 
 * Handles the logic of WHEN to send what notification
 * Controllers just pass the functions, this util decides what to call
 */

/**
 * 📤 Dispatch notification based on AuthMode
 * @param {Object} options - Configuration object
 * @param {string} options.authMode - AuthMode (EMAIL, PHONE, BOTH, EITHER)
 * @param {string|null} options.email - Email address
 * @param {string|null} options.phone - Phone number
 * @param {Function} options.emailFunction - Email sending function (pre-configured with data)
 * @param {Function} options.smsFunction - SMS sending function (pre-configured with data)
 * @param {string} options.eventType - Event type for logging (e.g., "Admin Created")
 */
const dispatchNotification = ({
  authMode,
  email,
  phone,
  emailFunction,
  smsFunction,
  eventType = "Notification"
}) => {
  try {
    // Validate AuthMode
    const validAuthModes = Object.values(AuthModes);
    if (!validAuthModes.includes(authMode)) {
      logWithTime(`⚠️ Invalid AuthMode: ${authMode}. Skipping notification for ${eventType}`);
      return;
    }

    logWithTime(`📡 Dispatching ${eventType} notification - AuthMode: ${authMode}`);

    switch (authMode) {
      case AuthModes.EMAIL:
        // Only send email
        if (email && emailFunction) {
          logWithTime(`📧 Sending email notification for ${eventType}`);
          emailFunction();
        } else {
          logWithTime(`⚠️ Email required but not available for ${eventType}`);
        }
        break;

      case AuthModes.PHONE:
        // Only send SMS
        if (phone && smsFunction) {
          logWithTime(`📱 Sending SMS notification for ${eventType}`);
          smsFunction();
        } else {
          logWithTime(`⚠️ Phone required but not available for ${eventType}`);
        }
        break;

      case AuthModes.BOTH:
        // Send both email and SMS
        let sentCount = 0;
        
        if (email && emailFunction) {
          logWithTime(`📧 Sending email notification for ${eventType}`);
          emailFunction();
          sentCount++;
        } else {
          logWithTime(`⚠️ Email not available for ${eventType} (BOTH mode)`);
        }

        if (phone && smsFunction) {
          logWithTime(`📱 Sending SMS notification for ${eventType}`);
          smsFunction();
          sentCount++;
        } else {
          logWithTime(`⚠️ Phone not available for ${eventType} (BOTH mode)`);
        }

        if (sentCount === 0) {
          logWithTime(`❌ No notifications sent for ${eventType} - neither email nor phone available`);
        } else if (sentCount === 1) {
          logWithTime(`⚠️ Only one notification sent for ${eventType} (BOTH mode requires both)`);
        } else {
          logWithTime(`✅ Both notifications dispatched for ${eventType}`);
        }
        break;

      case AuthModes.EITHER:
        // Send whichever is available (email preferred)
        if (email && emailFunction) {
          logWithTime(`📧 Sending email notification for ${eventType} (EITHER mode - email preferred)`);
          emailFunction();
        } else if (phone && smsFunction) {
          logWithTime(`📱 Sending SMS notification for ${eventType} (EITHER mode - phone fallback)`);
          smsFunction();
        } else {
          logWithTime(`⚠️ No contact method available for ${eventType}`);
        }
        break;

      default:
        logWithTime(`⚠️ Unhandled AuthMode: ${authMode}. Skipping notification for ${eventType}`);
    }

  } catch (error) {
    logWithTime(`❌ Error dispatching notification for ${eventType}: ${error.message}`);
  }
};

/**
 * 🎯 Convenience wrapper for Admin notifications
 * @param {Object} admin - Admin object
 * @param {Function} emailFunction - Pre-configured email function
 * @param {Function} smsFunction - Pre-configured SMS function
 * @param {string} eventType - Event type for logging
 */
const notifyAdmin = (admin, emailFunction, smsFunction, eventType) => {
  if (!admin) {
    logWithTime(`⚠️ No admin found for ${eventType} notification`);
    return;
  }

  // AuthMode should come from environment, not from admin object
  const authMode = process.env.AUTH_MODE || AuthModes.BOTH;

  dispatchNotification({
    authMode,
    email: admin.email,
    phone: admin.fullPhoneNumber,
    emailFunction,
    smsFunction,
    eventType
  });
};

/**
 * 🎯 Convenience wrapper for User notifications
 * @param {Object} user - User object 
 * @param {Function} emailFunction - Pre-configured email function
 * @param {Function} smsFunction - Pre-configured SMS function
 * @param {string} eventType - Event type for logging
 */
const notifyUser = (user, emailFunction, smsFunction, eventType) => {
  if (!user) {
    logWithTime(`⚠️ No user found for ${eventType} notification`);
    return;
  }

  // AuthMode should come from environment, not from user object
  const authMode = process.env.AUTH_MODE || AuthModes.BOTH;

  dispatchNotification({
    authMode,
    email: user.email,
    phone: user.fullPhoneNumber,
    emailFunction,
    smsFunction,
    eventType
  });
};

module.exports = {
  dispatchNotification,
  notifyAdmin,
  notifyUser
};
