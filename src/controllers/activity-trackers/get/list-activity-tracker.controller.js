const { ActivityTrackerModel } = require("@models/activity-tracker.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { OK } = require("@configs/http-status.config");
const { AdminType } = require("@configs/enums.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");

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
      'adminDetails.email': adminEmail,
      'adminDetails.fullPhoneNumber': adminPhone,
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

    // ✅ Hierarchical access control
    let query = {};

    if (actor.adminType === AdminType.SUPER_ADMIN) {
      // Super Admin: Can view ALL activity tracker logs
    } else if (actor.adminType === AdminType.MID_ADMIN) {
      // Mid Admin: Can only view regular ADMIN activities and their own
      const { AdminModel } = require("@models/admin.model");
      const allowedAdmins = await AdminModel.find({ adminType: AdminType.ADMIN }).select('adminId').lean();
      const allowedIds = [...allowedAdmins.map(a => a.adminId), actor.adminId];
      query.adminId = { $in: allowedIds };
    } else {
      // Regular ADMIN: Can only view their own activity
      query.adminId = actor.adminId;
    }

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

    if (adminEmail) {
      query['adminDetails.email'] = { $regex: adminEmail, $options: 'i' };
    }

    if (adminPhone) {
      query['adminDetails.fullPhoneNumber'] = { $regex: adminPhone, $options: 'i' };
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

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const [activities, totalCount] = await Promise.all([
      ActivityTrackerModel.find(query)
        .sort(sortObj)
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      ActivityTrackerModel.countDocuments(query)
    ]);

    // Calculate statistics
    const eventTypeCounts = await ActivityTrackerModel.aggregate([
      { $match: query },
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    logWithTime(`✅ Activity tracker list fetched by ${actor.adminId} (${actor.adminType}): ${activities.length}/${totalCount} records. Reason: ${reason}`);

    // ✅ Log this activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.LIST_ACTIVITY_TRACKER, {
      description: `Admin ${actor.adminId} listed activity tracker logs`,
      adminActions: {
        reason: reason
      }
    });

    return res.status(OK).json({
      message: "Activity tracker logs retrieved successfully",
      activities: activities,
      statistics: {
        eventTypeBreakdown: eventTypeCounts.map(e => ({ eventType: e._id, count: e.count }))
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalRecords: totalCount,
        recordsPerPage: parseInt(limit),
        hasNext: skip + activities.length < totalCount,
        hasPrevious: parseInt(page) > 1
      },
      filters: {
        primary: {
          adminId: adminId || null,
          eventType: eventType || null,
          performedBy: performedBy || null,
          deviceType: deviceType || null,
          deviceId: deviceId || null
        },
        nested: {
          adminDetails: {
            adminId: adminDetailsId || null,
            email: adminEmail || null,
            fullPhoneNumber: adminPhone || null
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
      },
      meta: {
        viewScope: actor.adminType === AdminType.SUPER_ADMIN ? "ALL_ACTIVITIES" : 
                   actor.adminType === AdminType.MID_ADMIN ? "REGULAR_ADMINS_AND_SELF" : "SELF_ONLY",
        fetchedBy: actor.adminId,
        reason: reason,
        fetchedAt: new Date()
      }
    });

  } catch (err) {
    logWithTime(`❌ Error fetching activity tracker list: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listActivityTracker };
