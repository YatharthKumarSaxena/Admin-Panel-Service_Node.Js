const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { listActivityTrackerService } = require("@services/activity-trackers/get/list-activity-tracker.service");
const { listActivityTrackerSuccessResponse } = require("@/responses/success/index");

/**
 * List Activity Tracker Controller
 * Returns comprehensive paginated list of all activity tracker logs with advanced filtering
 * Supports nested field searching and multiple filter combinations
 */

const listActivityTracker = async (req, res) => {
  try {
    const actor = req.admin;
    const { 
      page = 1, 
      limit = 50,
      // Primary filters
      adminId,            // Filter by specific admin
      eventType,          // Filter by specific event type
      performedBy,        // Filter by who performed (admin/system/super_admin/mid_admin)
      deviceType,         // Filter by device type (mobile/tablet/laptop)
      deviceId,           // Filter by specific device UUID
      // Nested adminDetails filters
      'adminDetails.adminId': adminDetailsId,
      // Nested adminActions filters
      'adminActions.targetId': targetUserId,
      'adminActions.reason': actionReason,
      // Description search
      description,        // Full-text search in description
      // Sorting
      sortBy = 'createdAt',
      sortOrder = 'desc',
      // Date range filters
      dateFrom,           // createdAt >= this date
      dateTo,             // createdAt <= this date
      // Timestamp filters
      createdBefore,      // createdAt < this timestamp
      createdAfter,       // createdAt > this timestamp
      updatedBefore,      // updatedAt < this timestamp
      updatedAfter        // updatedAt > this timestamp
    } = req.query;

    const { reason } = req.body;

    // Build query from filters
    let query = {};

    // Apply primary filters
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

    // Nested adminDetails filters
    if (adminDetailsId) {
      query['adminDetails.adminId'] = adminDetailsId;
    }

    // Nested adminActions filters
    if (targetUserId) {
      query['adminActions.targetId'] = targetUserId;
    }

    if (actionReason) {
      query['adminActions.reason'] = { $regex: actionReason, $options: 'i' };
    }

    // Description search
    if (description && description.trim()) {
      query.description = { $regex: description.trim(), $options: 'i' };
    }

    // 📅 Date filtering for createdAt
    if (dateFrom || dateTo || createdBefore || createdAfter) {
      query.createdAt = {};
      
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
      if (createdAfter && !dateFrom) {
        query.createdAt.$gt = new Date(createdAfter);
      }
      if (createdBefore && !dateTo) {
        query.createdAt.$lt = new Date(createdBefore);
      }
    }

    // 📅 Date filtering for updatedAt
    if (updatedBefore || updatedAfter) {
      query.updatedAt = {};
      
      if (updatedAfter) {
        query.updatedAt.$gt = new Date(updatedAfter);
      }
      if (updatedBefore) {
        query.updatedAt.$lt = new Date(updatedBefore);
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
    const result = await listActivityTrackerService(
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
      primary: {
        adminId: adminId || null,
        eventType: eventType || null,
        performedBy: performedBy || null,
        deviceType: deviceType || null,
        deviceId: deviceId || null
      },
      nested: {
        adminDetails: {
          adminId: adminDetailsId || null
        },
        adminActions: {
          targetId: targetUserId || null,
          reason: actionReason || null
        }
      },
      search: {
        description: description || null
      },
      dateRange: {
        createdAt: {
          from: dateFrom || createdAfter || null,
          to: dateTo || createdBefore || null
        },
        updatedAt: {
          after: updatedAfter || null,
          before: updatedBefore || null
        }
      },
      sorting: {
        sortBy: sortBy,
        sortOrder: sortOrder
      }
    };

    return listActivityTrackerSuccessResponse(
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
    logWithTime(`❌ Error fetching activity tracker list: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listActivityTracker };
