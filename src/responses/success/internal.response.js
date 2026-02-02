// INTERNAL SERVICE SUCCESS RESPONSES

const { OK } = require("@/configs/http-status.config");

const provideUserAccountDetailsSuccessResponse = (res, userDetails) => {
    return res.status(OK).json({
        success: true,
        message: "User account details retrieved successfully.",
        data: userDetails
    });
};

const getUserActiveDevicesSuccessResponse = (res, devices) => {
    return res.status(OK).json({
        success: true,
        message: "User active devices retrieved successfully.",
        data: {
            devices,
            count: devices.length
        }
    });
};

const checkAuthLogsSuccessResponse = (res, logs) => {
    return res.status(OK).json({
        success: true,
        message: "Auth logs retrieved successfully.",
        data: {
            logs,
            count: logs.length
        }
    });
};

const listAuthLogsSuccessResponse = (res, logs, totalCount, page, limit) => {
    return res.status(OK).json({
        success: true,
        message: "Auth logs retrieved successfully.",
        data: {
            logs,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            pageSize: logs.length
        }
    });
};

const cleanDeactivatedUsersSuccessResponse = (res, cleanedCount) => {
    return res.status(OK).json({
        success: true,
        message: `${cleanedCount} deactivated user(s) cleaned successfully.`,
        data: {
            cleanedCount
        }
    });
};

const internalSuccessResponses = {
    provideUserAccountDetailsSuccessResponse,
    getUserActiveDevicesSuccessResponse,
    checkAuthLogsSuccessResponse,
    listAuthLogsSuccessResponse,
    cleanDeactivatedUsersSuccessResponse
};

module.exports = {
    internalSuccessResponses
};
