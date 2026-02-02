const { AdminModel } = require("@models/admin.model");

/**
 * 🔍 Fetches an admin from the database based on adminId
 * @param {string} adminId - Admin's custom ID (e.g., ADM0000001)
 * @returns {Promise<Object|null>} - Returns the admin object if found, null otherwise
 */

const fetchAdmin = async (adminId) => {
  if (!adminId) {
    return null;
  }

  try {
    const admin = await AdminModel.findOne({ adminId }).lean();
    return admin;
  } catch (error) {
    console.error(`Error fetching admin ${adminId}:`, error);
    return null;
  }
};

module.exports = {
  fetchAdmin
};