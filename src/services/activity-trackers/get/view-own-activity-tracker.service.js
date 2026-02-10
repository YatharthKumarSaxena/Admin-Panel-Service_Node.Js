const { ActivityTrackerModel } = require("@models/activity-tracker.model");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * Service: View Own Activity Tracker
 * Retrieves paginated list of actor's own activity logs
 * No activity logging required (viewing own activity is not audit-worthy)
 * 
 * @param {Object} query - MongoDB filter object
 * @param {Object} options - Pagination and sorting options
 * @param {Object} actor - Admin requesting the list
 * @returns {Object} { success, data?, type?, message? }
 */
const viewOwnActivityTrackerService = async (
    query,
    options,
    actor
) => {
    try {
        const { page, limit, sortBy, sortOrder } = options;

        // Query only for actor's own activity
        const finalQuery = {
            ...query,
            adminId: actor.adminId
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
            viewScope: 'SELF_ONLY',
            fetchedBy: actor.adminId,
            fetchedAt: new Date()
        };

        logWithTime(`✅ Own activity tracker fetched by ${actor.adminId}: ${activities.length}/${totalCount} records`);

        // No activity logging here - viewing own activity is not audit-worthy

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
        logWithTime(`❌ Error in viewOwnActivityTrackerService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to retrieve your activity logs'
        };
    }
};

module.exports = {
    viewOwnActivityTrackerService
};
