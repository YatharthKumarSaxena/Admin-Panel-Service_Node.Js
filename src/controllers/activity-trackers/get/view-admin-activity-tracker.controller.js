const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers, throwAccessDeniedError } = require("@/responses/common/error-handler.response");
const { canActOnRole } = require("@/utils/role.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { viewAdminActivityTrackerService } = require("@services/activity-trackers/get/view-admin-activity-tracker.service");
const { viewAdminActivityTrackerSuccessResponse } = require("@/responses/success/index");

/**
 * View Single Admin Activity Tracker Controller
 * Returns activity tracker logs for a specific admin with pagination and filters
 */

const viewAdminActivityTracker = async (req, res) => {
  try {
    const actor = req.admin;
    const { 
      targetAdminId,
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

    const { reason } = req.body;

    // Hierarchical access control
    const foundAdmin = await fetchAdmin(null, null, targetAdminId);
    if (!foundAdmin) {
      logWithTime(`❌ Admin ${actor.adminId} attempted to view activity of non-existent admin ${targetAdminId} ${getLogIdentifiers(req)}`);
      return throwAccessDeniedError(res, "Target admin does not exist");
    }

    const allowed = canActOnRole(actor.adminType, foundAdmin.adminType);
    if (!allowed && targetAdminId !== actor.adminId) {
      logWithTime(`❌ Admin ${actor.adminId} attempted to view unauthorized activity of admin ${targetAdminId} ${getLogIdentifiers(req)}`);
      return throwAccessDeniedError(res, "You don't have permission to view this admin's activity");
    }

    // Build query from filters
    let query = {};

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

    // Call service (only if viewing OTHER admin's activity)
    const result = await viewAdminActivityTrackerService(
      targetAdminId,
      query,
      options,
      actor,
      reason,
      req.device,
      req.requestId
    );

    // Handle service errors
    if (!result.success) {
      return throwInternalServerError(res, result.message);
    }

    // Build filters object for response
    const filters = {
      targetAdminId: targetAdminId || null,
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

    return viewAdminActivityTrackerSuccessResponse(
      res,
      result.data.activities,
      result.data.total,
      page,
      limit,
      result.data.statistics,
      filters,
      result.data.targetAdminId,
      result.data.meta
    );

  } catch (err) {
    logWithTime(`❌ Error fetching admin activity tracker: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { viewAdminActivityTracker };
