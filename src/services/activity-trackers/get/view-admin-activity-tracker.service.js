const { ActivityTrackerModel } = require("@models/activity-tracker.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");

/**
 * Service: View Admin Activity Tracker
 * Retrieves paginated list of a specific admin's activity logs
 * 
 * @param {String} targetAdminId - Admin whose activity to view
 * @param {Object} query - MongoDB filter object
 * @param {Object} options - Pagination and sorting options
 * @param {Object} actor - Admin requesting the list
 * @param {String} reason - Reason for viewing
 * @param {Object} device - Device making the request
 * @param {String} requestId - Internal request ID for tracking
 * @returns {Object} { success, data?, type?, message? }
 */
const viewAdminActivityTrackerService = async (
    targetAdminId,
    query,
    options,
    actor,
    reason,
    device,
    requestId
) => {
    try {
        const { page, limit, sortBy, sortOrder } = options;

        // Query for target admin's activity
        const finalQuery = {
            ...query,
            adminId: targetAdminId
        };

        // Pagination
        const skip = (page - 1) * limit;

        // Sorting
        const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        // Execute query
        const [activities, totalCount] = await Promise.all([
            ActivityTrackerModel.find(finalQuery)
                .sort(sortObj)
                .limit(limit)
                .skip(skip)
                .lean(),
            ActivityTrackerModel.countDocuments(finalQuery)
        ]);

        // Calculate event type statistics
        const eventTypeCounts = await ActivityTrackerModel.aggregate([
            { $match: finalQuery },
            { $group: { _id: "$eventType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const statistics = {
            topEventTypes: eventTypeCounts.map(e => ({ eventType: e._id, count: e.count }))
        };

        const meta = {
            targetAdminId,
            fetchedBy: actor.adminId,
            reason: reason,
            fetchedAt: new Date()
        };

        logWithTime(`✅ Activity tracker for admin ${targetAdminId} fetched by ${actor.adminId}: ${activities.length}/${totalCount} records. Reason: ${reason}`);

        // Activity tracking
        await logActivityTrackerEvent(
            actor,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.VIEW_ADMIN_ACTIVITY_TRACKER,
            `Admin ${actor.adminId} viewed activity logs of admin ${targetAdminId}`,
            {
                adminActions: {
                    targetId: targetAdminId,
                    reason: reason
                }
            }
        );

        return {
            success: true,
            data: {
                targetAdminId,
                activities,
                total: totalCount,
                statistics,
                meta
            }
        };

    } catch (error) {
        logWithTime(`❌ Error in viewAdminActivityTrackerService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to retrieve admin activity logs'
        };
    }
};

module.exports = {
    viewAdminActivityTrackerService
};
