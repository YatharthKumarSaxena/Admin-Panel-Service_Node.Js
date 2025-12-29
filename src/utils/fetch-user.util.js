const { UserModel } = require("@models/user.model");
const { logWithTime } = require("./time-stamps.util");
const { errorMessage } = require("./error-handler.util");
const { AuthModes } = require("@configs/enums.config");

/**
 * 🔍 Fetches a user from the database based on auth mode
 * @param {string} email - User's email address
 * @param {string} fullPhoneNumber - User's full phone number
 * @returns {Promise<boolean>} - Returns true if user exists, false otherwise
 */

const fetchUser = async (email, fullPhoneNumber) => {
  try {
    const authMode = process.env.DEFAULT_AUTH_MODE || AuthModes.BOTH;

    // Conditions ko array main collect karenge for $or operator
    let query = [];

    if (authMode === AuthModes.EMAIL) {
      if (!email) {
        logWithTime("⚠️ Email is required for EMAIL auth mode");
        return null;
      }
      query = [{ email }];
    } 
    
    else if (authMode === AuthModes.PHONE) {
      if (!fullPhoneNumber) {
        logWithTime("⚠️ Phone number is required for PHONE auth mode");
        return null;
      }
      query = [{ fullPhoneNumber }];
    } 
    
    else if (authMode === AuthModes.BOTH) {
      if (!email || !fullPhoneNumber) {
        logWithTime("⚠️ Both email and phone number are required for BOTH auth mode");
        return null;
      }
      // Fix: Dono ko alag objects main daala taaki OR logic bane
      query = [{ email }, { fullPhoneNumber }];
    } 
    
    else if (authMode === AuthModes.EITHER) {
      if (!email && !fullPhoneNumber) {
        logWithTime("⚠️ Either email or phone number is required for EITHER auth mode");
        return null;
      }
      // Fix: Array main push kiya taaki $or syntax valid rahe
      if (email) query.push({ email });
      if (fullPhoneNumber) query.push({ fullPhoneNumber });
    }

    const user = await UserModel.findOne({ $or: query }).lean();

    if (user) {
      logWithTime(`✅ User found: ${user.userId || user.email || user.fullPhoneNumber}`);
      return user;
    } else {
      logWithTime(`❌ User not found with query: ${JSON.stringify(query)}`);
      return null;
    }
  } catch (err) {
    logWithTime("❌ Error occurred while fetching user");
    errorMessage(err);
    return null;
  }
};

module.exports = {
  fetchUser
};