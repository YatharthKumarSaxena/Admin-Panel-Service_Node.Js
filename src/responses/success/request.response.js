// REQUEST SUCCESS RESPONSES

const { OK, CREATED } = require("@/configs/http-status.config");
const { logWithTime } = require("@/utils/time-stamps.util");

const createActivationRequestSuccessResponse = (res, request) => {
    logWithTime(`✅ Activation request created: ${request._id} for ${request.targetAdminId}`);
    return res.status(CREATED).json({
        success: true,
        message: "Activation request created successfully.",
        data: {
            requestId: request._id,
            targetAdminId: request.targetAdminId,
            requestType: request.requestType,
            status: request.status,
            createdAt: request.createdAt
        }
    });
};

const createDeactivationRequestSuccessResponse = (res, request) => {
    logWithTime(`✅ Deactivation request created: ${request._id} for ${request.targetAdminId}`);
    return res.status(CREATED).json({
        success: true,
        message: "Deactivation request created successfully.",
        data: {
            requestId: request._id,
            targetAdminId: request.targetAdminId,
            requestType: request.requestType,
            status: request.status,
            createdAt: request.createdAt
        }
    });
};

const approveActivationRequestSuccessResponse = (res, request, reviewer) => {
    logWithTime(`✅ Activation request approved: ${request._id} by ${reviewer.adminId}`);
    return res.status(OK).json({
        success: true,
        message: "Activation request approved successfully.",
        data: {
            requestId: request._id,
            targetAdminId: request.targetAdminId,
            status: request.status,
            reviewedBy: request.reviewedBy,
            reviewReason: request.reviewReason,
            reviewedAt: request.reviewedAt
        }
    });
};

const approveDeactivationRequestSuccessResponse = (res, request, reviewer) => {
    logWithTime(`✅ Deactivation request approved: ${request._id} by ${reviewer.adminId}`);
    return res.status(OK).json({
        success: true,
        message: "Deactivation request approved successfully.",
        data: {
            requestId: request._id,
            targetAdminId: request.targetAdminId,
            status: request.status,
            reviewedBy: request.reviewedBy,
            reviewReason: request.reviewReason,
            reviewedAt: request.reviewedAt
        }
    });
};

const rejectActivationRequestSuccessResponse = (res, request, reviewer) => {
    logWithTime(`✅ Activation request rejected: ${request._id} by ${reviewer.adminId}`);
    return res.status(OK).json({
        success: true,
        message: "Activation request rejected successfully.",
        data: {
            requestId: request._id,
            targetAdminId: request.targetAdminId,
            status: request.status,
            reviewedBy: request.reviewedBy,
            reviewReason: request.reviewReason,
            reviewedAt: request.reviewedAt
        }
    });
};

const rejectDeactivationRequestSuccessResponse = (res, request, reviewer) => {
    logWithTime(`✅ Deactivation request rejected: ${request._id} by ${reviewer.adminId}`);
    return res.status(OK).json({
        success: true,
        message: "Deactivation request rejected successfully.",
        data: {
            requestId: request._id,
            targetAdminId: request.targetAdminId,
            status: request.status,
            reviewedBy: request.reviewedBy,
            reviewReason: request.reviewReason,
            reviewedAt: request.reviewedAt
        }
    });
};

const listAllStatusRequestsSuccessResponse = (res, requests, totalCount, page, limit) => {
    return res.status(OK).json({
        success: true,
        message: "Status requests retrieved successfully.",
        data: {
            requests,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            pageSize: requests.length
        }
    });
};

const viewStatusRequestSuccessResponse = (res, request) => {
    return res.status(OK).json({
        success: true,
        message: "Status request details retrieved successfully.",
        data: request
    });
};

const requestSuccessResponses = {
    createActivationRequestSuccessResponse,
    createDeactivationRequestSuccessResponse,
    approveActivationRequestSuccessResponse,
    approveDeactivationRequestSuccessResponse,
    rejectActivationRequestSuccessResponse,
    rejectDeactivationRequestSuccessResponse,
    listAllStatusRequestsSuccessResponse,
    viewStatusRequestSuccessResponse
};

module.exports = {
    requestSuccessResponses
};
