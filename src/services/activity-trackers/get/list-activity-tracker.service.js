const { ActivityTrackerModel } = require("@models/activity-tracker.model");
const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");
const { AdminType, viewScope } = require("@configs/enums.config");

/**
 * Service: List Activity Tracker
 * Retrieves paginated list of activity logs with hierarchical access control
 * 
 * @param {Object} query - MongoDB filter object
 * @param {Object} options - Pagination and sorting options
 * @param {Object} actor - Admin requesting the list
 * @param {String} reason - Reason for viewing
 * @param {Object} device - Device making the request
 * @param {String} requestId - Internal request ID for tracking
 * @returns {Object} { success, data?, type?, message? }
 */
const listActivityTrackerService = async (
    query,
    options,
    actor,
    reason,
    device,
    requestId
) => {
    try {
        const { page, limit, sortBy, sortOrder } = options;

        // Hierarchical access control
        let finalQuery = { ...query };

        if (actor.adminType === AdminType.SUPER_ADMIN) {
            // Super Admin: Can view ALL activity tracker logs
        } else if (actor.adminType === AdminType.MID_ADMIN) {
            // Mid Admin: Can only view regular ADMIN activities and their own
            const allowedAdmins = await AdminModel.find({ adminType: AdminType.ADMIN }).select('adminId').lean();
            const allowedIds = [...allowedAdmins.map(a => a.adminId), actor.adminId];
            finalQuery.adminId = { $in: allowedIds };
        } else {
            // Regular ADMIN: Can only view their own activity
            finalQuery.adminId = actor.adminId;
        }

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

        // Calculate statistics
        const eventTypeCounts = await ActivityTrackerModel.aggregate([
            { $match: finalQuery },
            { $group: { _id: "$eventType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const statistics = {
            eventTypeBreakdown: eventTypeCounts.map(e => ({ eventType: e._id, count: e.count }))
        };

        const meta = {
            viewScope: actor.adminType === AdminType.SUPER_ADMIN ? viewScope.ALL : (actor.adminType === AdminType.MID_ADMIN ? viewScope.ADMINS_ONLY : viewScope.SELF_ONLY),
            fetchedBy: actor.adminId,
            reason: reason,
            fetchedAt: new Date()
        };

        logWithTime(`✅ Activity tracker list fetched by ${actor.adminId} (${actor.adminType}): ${activities.length}/${totalCount} records. Reason: ${reason}`);

        // Activity tracking
        await logActivityTrackerEvent(
            actor,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.LIST_ACTIVITY_TRACKER,
            `Admin ${actor.adminId} listed activity tracker logs`,
            {
                adminActions: {
                    reason: reason
                }
            }
        );

        return {
            success: true,
            data: {
                activities,
                total: totalCount,
                statistics,
                meta
            }
        };

    } catch (error) {
        logWithTime(`❌ Error in listActivityTrackerService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to retrieve activity tracker logs'
        };
    }
};

module.exports = {
    listActivityTrackerService
};
