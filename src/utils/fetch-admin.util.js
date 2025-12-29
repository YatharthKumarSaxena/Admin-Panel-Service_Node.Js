const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("./time-stamps.util");
const { errorMessage } = require("./error-handler.util");
const { AuthModes } = require("@configs/enums.config");

/**
 * 🔍 Fetches an admin from the database based on auth mode
 * @param {string} email - Admin's email address
 * @param {string} fullPhoneNumber - Admin's full phone number
 * @returns {Promise<Object|null>} - Returns the admin object if found, null otherwise
 */

const fetchAdmin = async (email, fullPhoneNumber) => {
  try {
    const authMode = process.env.DEFAULT_AUTH_MODE || AuthModes.BOTH;

    // Hum conditions ko is array main collect karenge taaki $or operator use kar sakein
    let conditions = [];

    if (authMode === AuthModes.EMAIL) {
      if (!email) {
        logWithTime("⚠️ Email is required for EMAIL auth mode");
        return null;
      }
      conditions.push({ email });
    } 
    
    else if (authMode === AuthModes.PHONE) {
      if (!fullPhoneNumber) {
        logWithTime("⚠️ Phone number is required for PHONE auth mode");
        return null;
      }
      conditions.push({ fullPhoneNumber });
    } 
    
    else if (authMode === AuthModes.BOTH) {
      if (!email || !fullPhoneNumber) {
        logWithTime("⚠️ Both email and phone number are required for BOTH auth mode");
        return null;
      }

      conditions.push({ email });
      conditions.push({ fullPhoneNumber });
    } 
    
    else if (authMode === AuthModes.EITHER) {
      if (!email && !fullPhoneNumber) {
        logWithTime("⚠️ Either email or phone number is required for EITHER auth mode");
        return null;
      }

      if (email) conditions.push({ email });
      if (fullPhoneNumber) conditions.push({ fullPhoneNumber });
    }

    // Final Query Construction with $or to prevent crashes
    const query = { $or: conditions };

    const admin = await AdminModel.findOne(query).lean();

    if (admin) {
      logWithTime(`✅ Admin found: ${admin.adminId || admin.email || admin.fullPhoneNumber}`);
      return admin;
    } else {
      logWithTime(`❌ Admin not found with query: ${JSON.stringify(query)}`);
      return null;
    }
  } catch (err) {
    logWithTime("❌ Error occurred while fetching admin");
    errorMessage(err);
    return null;
  }
};

module.exports = {
  fetchAdmin
};