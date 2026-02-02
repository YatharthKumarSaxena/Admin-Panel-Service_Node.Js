// ADMIN SUCCESS RESPONSES

const { OK, CREATED } = require("@/configs/http-status.config");

const createAdminSuccessResponse = (res, admin) => {
    return res.status(CREATED).json({
        success: true,
        message: "Admin created successfully.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            adminType: admin.adminType,
            supervisorId: admin.supervisorId,
            isActive: admin.isActive,
            createdAt: admin.createdAt
        }
    });
};

const bulkCreateAdminsSuccessResponse = (res, successCount, failureCount, results) => {
    return res.status(CREATED).json({
        success: true,
        message: `${successCount} admin(s) created successfully. ${failureCount} failed.`,
        data: {
            successCount,
            failureCount,
            results
        }
    });
};

const activateAdminSuccessResponse = (res, admin, activator) => {
    return res.status(OK).json({
        success: true,
        message: "Admin activated successfully.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            isActive: admin.isActive,
            activatedBy: admin.activatedBy,
            activatedReason: admin.activatedReason
        }
    });
};

const deactivateAdminSuccessResponse = (res, admin, deactivator) => {
    return res.status(OK).json({
        success: true,
        message: "Admin deactivated successfully.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            isActive: admin.isActive,
            deactivatedBy: admin.deactivatedBy,
            deactivatedReason: admin.deactivatedReason
        }
    });
};

const updateAdminDetailsSuccessResponse = (res, admin, updatedFields) => {
    return res.status(OK).json({
        success: true,
        message: "Admin details updated successfully.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            updatedFields,
            updatedAt: admin.updatedAt
        }
    });
};

const updateOwnAdminDetailsSuccessResponse = (res, admin, updatedFields) => {
    return res.status(OK).json({
        success: true,
        message: "Your details updated successfully.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            updatedFields,
            updatedAt: admin.updatedAt
        }
    });
};

const updateAdminRoleSuccessResponse = (res, admin, oldRole, newRole) => {
    return res.status(OK).json({
        success: true,
        message: "Admin role updated successfully.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            previousRole: oldRole,
            newRole: newRole,
            adminType: admin.adminType,
            updatedAt: admin.updatedAt
        }
    });
};

const changeSupervisorSuccessResponse = (res, admin, oldSupervisorId, newSupervisorId) => {
    return res.status(OK).json({
        success: true,
        message: "Supervisor changed successfully.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            previousSupervisor: oldSupervisorId,
            newSupervisor: newSupervisorId,
            updatedAt: admin.updatedAt
        }
    });
};

const listAdminsSuccessResponse = (res, admins, totalCount, page, limit) => {
    return res.status(OK).json({
        success: true,
        message: "Admins retrieved successfully.",
        data: {
            admins,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            pageSize: admins.length
        }
    });
};

const viewAdminDetailsSuccessResponse = (res, admin) => {
    return res.status(OK).json({
        success: true,
        message: "Admin details retrieved successfully.",
        data: admin
    });
};

const viewOwnAdminDetailsSuccessResponse = (res, admin) => {
    return res.status(OK).json({
        success: true,
        message: "Your details retrieved successfully.",
        data: admin
    });
};

const getAdminStatsSuccessResponse = (res, stats) => {
    return res.status(OK).json({
        success: true,
        message: "Admin statistics retrieved successfully.",
        data: stats
    });
};

const adminSuccessResponses = {
    createAdminSuccessResponse,
    bulkCreateAdminsSuccessResponse,
    activateAdminSuccessResponse,
    deactivateAdminSuccessResponse,
    updateAdminDetailsSuccessResponse,
    updateOwnAdminDetailsSuccessResponse,
    updateAdminRoleSuccessResponse,
    changeSupervisorSuccessResponse,
    listAdminsSuccessResponse,
    viewAdminDetailsSuccessResponse,
    viewOwnAdminDetailsSuccessResponse,
    getAdminStatsSuccessResponse
};

module.exports = {
    adminSuccessResponses
};
