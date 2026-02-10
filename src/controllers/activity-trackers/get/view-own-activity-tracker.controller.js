const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { viewOwnActivityTrackerService } = require("@services/activity-trackers/get/view-own-activity-tracker.service");
const { viewOwnActivityTrackerSuccessResponse } = require("@/responses/success/index");

/**
 * View Own Activity Tracker Controller
 * Allows admins to view their own activity tracker logs
 * No activity logging required (viewing own activity is not audit-worthy)
 */

const viewOwnActivityTracker = async (req, res) => {
  try {
    const actor = req.admin;
    const { 
      page = 1, 
      limit = 50,
      eventType,          // Filter by specific event
      performedBy,        // Filter by who performed
      deviceType,         // Filter by device type
      sortBy = 'createdAt',
      sortOrder = 'desc',
      // Date filters
      dateFrom,           // createdAt >= this date
      dateTo,             // createdAt <= this date
      // Nested search filters
      'adminActions.targetId': targetUserId,  // Search by target user
      description,        // Search in description
      deviceId            // Filter by specific device
    } = req.query;

    // Build query from filters
    const query = {};

    // Apply filters
    if (eventType) {
      query.eventType = eventType;
    }

    if (performedBy) {
      query.performedBy = performedBy;
    }

    if (deviceType) {
      query.deviceType = deviceType;
    }

    if (deviceId) {
      query.deviceId = deviceId;
    }

    // Nested field filters
    if (targetUserId) {
      query['adminActions.targetId'] = targetUserId;
    }

    if (description && description.trim()) {
      query.description = { $regex: description.trim(), $options: 'i' };
    }

    // 📅 Date filtering
    if (dateFrom || dateTo) {
      query.createdAt = {};
      
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    // Pagination and sorting options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    };

    // Call service
    const result = await viewOwnActivityTrackerService(
      query,
      options,
      actor
    );

    // Handle service errors
    if (!result.success) {
      return throwInternalServerError(res, result.message);
    }

    // Build filters object for response
    const filters = {
      eventType: eventType || null,
      performedBy: performedBy || null,
      deviceType: deviceType || null,
      deviceId: deviceId || null,
      targetId: targetUserId || null,
      description: description || null,
      dateRange: {
        from: dateFrom || null,
        to: dateTo || null
      },
      sortBy: sortBy,
      sortOrder: sortOrder
    };

    return viewOwnActivityTrackerSuccessResponse(
      res,
      result.data.activities,
      result.data.total,
      page,
      limit,
      result.data.statistics,
      filters,
      result.data.meta
    );

  } catch (err) {
    logWithTime(`❌ Error fetching own activity tracker: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { viewOwnActivityTracker };
