const { logWithTime } = require("./time-stamps.util");
const { errorMessage } = require("./error-handler.util");
const { AuthModes } = require("@configs/enums.config");

/**
 * 🏭 Factory function to fetch any entity (Admin/User) from database
 * @param {Object} Model - Mongoose model (AdminModel or UserModel)
 * @param {string|null} email - Entity's email address
 * @param {string|null} fullPhoneNumber - Entity's full phone number
 * @param {string|null} userId - Entity's custom userId
 * @param {string} entityType - Type of entity ("Admin" or "User") for logging
 * @param {string} userIdField - Field name for userId in model (e.g., "adminId" or "userId")
 * @returns {Promise<Object|null>} - Returns the entity object if found, null otherwise
 */
const fetchEntity = async (
  Model, 
  email = null, 
  fullPhoneNumber = null, 
  userId = null, 
  entityType = "Entity",
  userIdField = "userId"
) => {
  try {
    // Priority 1: userId
    if (userId) {
      const query = { [userIdField]: userId };
      const entity = await Model.findOne(query).lean();
      
      if (entity) {
        logWithTime(`✅ ${entityType} found by userId: ${entity[userIdField]}`);
        return entity;
      } else {
        logWithTime(`❌ ${entityType} not found with userId: ${userId}`);
        return null;
      }
    }

    // Priority 2: Email/Phone based fetch
    const authMode = process.env.AUTH_MODE || AuthModes.BOTH;

    // Conditions ko is array main collect karenge taaki $or operator use kar sakein
    let conditions = [];

    if (authMode === AuthModes.EMAIL) {
      if (!email) {
        logWithTime(`⚠️ Email is required for EMAIL auth mode (${entityType})`);
        return null;
      }
      conditions.push({ email });
    } 
    
    else if (authMode === AuthModes.PHONE) {
      if (!fullPhoneNumber) {
        logWithTime(`⚠️ Phone number is required for PHONE auth mode (${entityType})`);
        return null;
      }
      conditions.push({ fullPhoneNumber });
    } 
    
    else if (authMode === AuthModes.BOTH) {
      if (!email || !fullPhoneNumber) {
        logWithTime(`⚠️ Both email and phone number are required for BOTH auth mode (${entityType})`);
        return null;
      }
      conditions.push({ email });
      conditions.push({ fullPhoneNumber });
    } 
    
    else if (authMode === AuthModes.EITHER) {
      if (!email && !fullPhoneNumber) {
        logWithTime(`⚠️ Either email or phone number is required for EITHER auth mode (${entityType})`);
        return null;
      }
      if (email) conditions.push({ email });
      if (fullPhoneNumber) conditions.push({ fullPhoneNumber });
    }

    // Agar koi condition nahi bani, return null
    if (conditions.length === 0) {
      logWithTime(`❌ No valid conditions for ${entityType} fetch`);
      return null;
    }

    // Final Query Construction with $or to prevent crashes
    const query = { $or: conditions };
    const entity = await Model.findOne(query).lean();

    if (entity) {
      logWithTime(`✅ ${entityType} found: ${entity[userIdField] || entity.email || entity.fullPhoneNumber}`);
      return entity;
    } else {
      logWithTime(`❌ ${entityType} not found with query: ${JSON.stringify(query)}`);
      return null;
    }
    
  } catch (err) {
    logWithTime(`❌ Error occurred while fetching ${entityType}`);
    errorMessage(err);
    return null;
  }
};

module.exports = {
  fetchEntity
};
