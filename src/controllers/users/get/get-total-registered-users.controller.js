const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");

/**
 * Get Total Registered Users Controller
 * Returns count of total registered users with optional filters
 */

const getTotalRegisteredUsers = async (req, res) => {
  try {
    const admin = req.admin;
    const { includeBlocked = false, startDate, endDate } = req.query;

    logWithTime(`📊 Admin ${admin.adminId} requesting total registered users count`);

    // Build query
    const query = {};

    // Filter by blocked status if needed
    if (!includeBlocked) {
      query.isBlocked = { $ne: true };
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Get total count
    const totalUsers = await UserModel.countDocuments(query);

    // Get additional statistics
    const stats = {
      totalRegistered: totalUsers,
      blockedUsers: await UserModel.countDocuments({ isBlocked: true }),
      unblockedUsers: totalUsers - blockedUsers,
      filters: {
        includeBlocked: includeBlocked === 'true',
        startDate: startDate || null,
        endDate: endDate || null
      }
    };

    logWithTime(`✅ Total users count: ${totalUsers} retrieved by ${admin.adminId}`);

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.GET_TOTAL_REGISTERED_USERS, {
      description: `Admin ${admin.adminId} retrieved total registered users count`,
      adminActions: {
        filters: stats.filters
      }
    });

    return res.status(OK).json({
      message: "Total registered users retrieved successfully",
      data: stats,
      retrievedBy: admin.adminId
    });

  } catch (err) {
    logWithTime(`❌ Internal Error in getting total users ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { getTotalRegisteredUsers };
