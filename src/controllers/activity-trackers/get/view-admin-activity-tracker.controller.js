const { ActivityTrackerModel } = require("@models/activity-tracker.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers, throwAccessDeniedError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { AdminType } = require("@configs/enums.config");
const { canActOnRole } = require("@/utils/role.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");

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
      'adminDetails.email': adminEmail,           // Search by admin email
      'adminDetails.fullPhoneNumber': adminPhone, // Search by admin phone
      'adminActions.targetId': targetUserId,  // Search by target user
      description,        // Search in description
      deviceId            // Filter by specific device
    } = req.query;

    const { reason } = req.body;

    // ✅ Hierarchical access control
    let query = {};

    const foundAdmin = fetchAdmin(null, null, targetAdminId);
    if (!foundAdmin) {
      logWithTime(`❌ Admin ${actor.adminId} attempted to view activity of non-existent admin ${targetAdminId} ${getLogIdentifiers(req)}`);
      return throwAccessDeniedError(res, "Target admin does not exist");
    }

    const allowed = canActOnRole(actor.adminType, foundAdmin.adminType);
    if (!allowed && targetAdminId !== actor.adminId) {
      logWithTime(`❌ Admin ${actor.adminId} attempted to view unauthorized activity of admin ${targetAdminId} ${getLogIdentifiers(req)}`);
      return throwAccessDeniedError(res, "You don't have permission to view this admin's activity");
    }

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
    if (adminEmail) {
      query['adminDetails.email'] = { $regex: adminEmail, $options: 'i' };
    }

    if (adminPhone) {
      query['adminDetails.fullPhoneNumber'] = { $regex: adminPhone, $options: 'i' };
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

    logWithTime(`✅ Activity tracker fetched by ${actor.adminId} for ${targetAdminId || 'all admins'}: ${activities.length}/${totalCount} records. Reason: ${reason}`);

    // ✅ Log activity only when viewing OTHER admin's activity (not self)
    if (targetAdminId && targetAdminId !== actor.adminId) {
      logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.VIEW_ADMIN_ACTIVITY_TRACKER, {
        description: `Admin ${actor.adminId} viewed activity tracker of admin ${targetAdminId}`,
        adminActions: {
          targetId: targetAdminId,
          reason: reason
        }
      });
    }

    return res.status(OK).json({
      message: "Admin activity tracker retrieved successfully",
      activities: activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalRecords: totalCount,
        recordsPerPage: parseInt(limit),
        hasNext: skip + activities.length < totalCount,
        hasPrevious: parseInt(page) > 1
      },
      filters: {
        targetAdminId: targetAdminId || null,
        eventType: eventType || null,
        performedBy: performedBy || null,
        deviceType: deviceType || null,
        deviceId: deviceId || null,
        adminEmail: adminEmail || null,
        adminPhone: adminPhone || null,
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
        viewScope: actor.adminType === AdminType.SUPER_ADMIN ? "ALL_ADMINS" : 
                   actor.adminType === AdminType.MID_ADMIN ? "REGULAR_ADMINS_AND_SELF" : "SELF_ONLY",
        fetchedBy: actor.adminId,
        reason: reason,
        fetchedAt: new Date()
      }
    });

  } catch (err) {
    logWithTime(`❌ Error fetching admin activity tracker: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { viewAdminActivityTracker };
