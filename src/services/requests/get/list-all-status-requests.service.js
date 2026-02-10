const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");

/**
 * Service: List All Status Requests
 * Retrieves paginated list of status requests with filters
 * 
 * @param {Object} filter - MongoDB filter object
 * @param {Object} options - Pagination and sorting options
 * @param {Object} actor - Admin requesting the list
 * @param {Object} device - Device making the request
 * @param {String} requestIdIn - Internal request ID for tracking
 * @returns {Object} { success, data?, type?, message? }
 */
const listAllStatusRequestsService = async (
    filter,
    options,
    actor,
    device,
    requestIdIn
) => {
    try {
        const { page, limit, sortBy, sortOrder } = options;

        // Pagination
        const skip = (page - 1) * limit;

        // Sorting
        const sort = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1
        };

        // Execute query
        const [requests, totalCount] = await Promise.all([
            AdminStatusRequestModel.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            AdminStatusRequestModel.countDocuments(filter)
        ]);

        logWithTime(`✅ Status requests list fetched by admin ${actor.adminId}: ${requests.length}/${totalCount} records`);

        // Activity tracking - minimal logging for list operations
        await logActivityTrackerEvent(
            {
                admin: actor,
                device,
                requestId: requestIdIn
            },
            ACTIVITY_TRACKER_EVENTS.VIEW_STATUS_REQUESTS,
            {
                description: `Admin ${actor.adminId} viewed status requests list`,
                adminActions: {
                    targetId: null,
                    reason: `Listed ${requests.length} requests`
                }
            }
        );

        return {
            success: true,
            data: {
                requests,
                total: totalCount
            }
        };

    } catch (error) {
        logWithTime(`❌ Error in listAllStatusRequestsService: ${error.message}`);
        return {
            success: false,
            message: error.message || 'Failed to retrieve status requests'
        };
    }
};

module.exports = {
    listAllStatusRequestsService
};
