// USER SUCCESS RESPONSES

const { OK } = require("@/configs/http-status.config");
const { logWithTime } = require("@/utils/time-stamps.util");

const blockUserSuccessResponse = (res, user, blockedBy) => {
    logWithTime(`✅ User blocked: ${user.userId} by ${blockedBy.adminId}`);
    return res.status(OK).json({
        success: true,
        message: "User blocked successfully.",
        data: {
            userId: user.userId,
            firstName: user.firstName,
            isBlocked: user.isBlocked,
            blockReason: user.blockReason,
            blockedBy: user.blockedBy,
            blockedAt: user.blockedAt
        }
    });
};

const unblockUserSuccessResponse = (res, user, unblockedBy) => {
    logWithTime(`✅ User unblocked: ${user.userId} by ${unblockedBy.adminId}`);
    return res.status(OK).json({
        success: true,
        message: "User unblocked successfully.",
        data: {
            userId: user.userId,
            firstName: user.firstName,
            isBlocked: user.isBlocked,
            unblockReason: user.unblockReason,
            unblockedBy: user.unblockedBy,
            unblockedAt: user.unblockedAt
        }
    });
};

const listUsersSuccessResponse = (res, users, totalCount, page, limit) => {
    return res.status(OK).json({
        success: true,
        message: "Users retrieved successfully.",
        data: {
            users,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            pageSize: users.length
        }
    });
};

const viewUserDetailsSuccessResponse = (res, user) => {
    return res.status(OK).json({
        success: true,
        message: "User details retrieved successfully.",
        data: user
    });
};

const getUserStatsSuccessResponse = (res, stats) => {
    return res.status(OK).json({
        success: true,
        message: "User statistics retrieved successfully.",
        data: stats
    });
};

const userSuccessResponses = {
    blockUserSuccessResponse,
    unblockUserSuccessResponse,
    listUsersSuccessResponse,
    viewUserDetailsSuccessResponse,
    getUserStatsSuccessResponse
};

module.exports = {
    userSuccessResponses
};
