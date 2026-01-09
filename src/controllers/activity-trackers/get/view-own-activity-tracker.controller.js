const { ActivityTrackerModel } = require("@models/activity-tracker.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { viewScope } = require("@configs/enums.config");

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

    // ✅ Query only for actor's own activity
    const query = {
      adminId: actor.adminId
    };

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

    // Calculate event type statistics
    const eventTypeCounts = await ActivityTrackerModel.aggregate([
      { $match: query },
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    logWithTime(`✅ Own activity tracker fetched by ${actor.adminId}: ${activities.length}/${totalCount} records`);

    // ❌ No activity logging here - viewing own activity is not audit-worthy

    return res.status(OK).json({
      message: "Your activity tracker retrieved successfully",
      activities: activities,
      statistics: {
        totalActivities: totalCount,
        topEvents: eventTypeCounts.map(e => ({ 
          eventType: e._id, 
          count: e.count 
        }))
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
      },
      meta: {
        viewScope: viewScope.SELF_ONLY,
        fetchedBy: actor.adminId,
        fetchedAt: new Date()
      }
    });

  } catch (err) {
    logWithTime(`❌ Error fetching own activity tracker: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { viewOwnActivityTracker };
