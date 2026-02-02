// ACTIVITY TRACKER SUCCESS RESPONSES

const { OK } = require("@/configs/http-status.config");

const listActivityTrackerSuccessResponse = (res, activities, totalCount, page, limit) => {
    return res.status(OK).json({
        success: true,
        message: "Activity tracker retrieved successfully.",
        data: {
            activities,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            pageSize: activities.length
        }
    });
};

const viewOwnActivityTrackerSuccessResponse = (res, activities, totalCount, page, limit) => {
    return res.status(OK).json({
        success: true,
        message: "Your activity tracker retrieved successfully.",
        data: {
            activities,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            pageSize: activities.length
        }
    });
};

const viewAdminActivityTrackerSuccessResponse = (res, activities, totalCount, page, limit, targetAdminId) => {
    return res.status(OK).json({
        success: true,
        message: `Activity tracker for ${targetAdminId} retrieved successfully.`,
        data: {
            activities,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            pageSize: activities.length
        }
    });
};

const activityTrackerSuccessResponses = {
    listActivityTrackerSuccessResponse,
    viewOwnActivityTrackerSuccessResponse,
    viewAdminActivityTrackerSuccessResponse
};

module.exports = {
    activityTrackerSuccessResponses
};
