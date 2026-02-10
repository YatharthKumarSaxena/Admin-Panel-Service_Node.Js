const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwAccessDeniedError, throwDBResourceNotFoundError } = require("@/responses/common/error-handler.response");
const { AdminType } = require("@configs/enums.config");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { notifyNewSupervisorAssigned, notifySupervisorChanged, notifyOldSupervisorRemoved } = require("@utils/admin-notifications.util");
const { changeSupervisorService } = require("@/services/admins/update/change-supervisor.service");
const { changeSupervisorSuccessResponse } = require("@/responses/success/admin.response");

/**
 * Change Supervisor Controller
 * Allows changing the supervisor of an admin
 * Super Admin can change any admin's supervisor
 * Mid Admin can only change their subordinates' supervisors
 */

const changeSupervisor = async (req, res) => {
    try {
        const actor = req.admin;
        const { newSupervisorId, reason } = req.body;
        const targetAdmin = req.foundAdmin;
        const device = req.device;

        // Super Admin cannot have a supervisor
        if (targetAdmin.adminType === AdminType.SUPER_ADMIN) {
            logWithTime(`❌ Attempt to change supervisor for Super Admin ${getLogIdentifiers(req)}`);
            return throwAccessDeniedError(res, "Super Admin cannot have a supervisor");
        }

        // Check if already has the same supervisor
        if (targetAdmin.supervisorId === newSupervisorId) {
            logWithTime(`⚠️ Admin ${targetAdmin.adminId} already has supervisor ${newSupervisorId} ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "Admin already has this supervisor");
        }

        const newSupervisor = await fetchAdmin(null, null, newSupervisorId);
        if (!newSupervisor) {
            logWithTime(`❌ New supervisor ${newSupervisorId} not found ${getLogIdentifiers(req)}`);
            return throwDBResourceNotFoundError(res, "New supervisor");
        }

        // New supervisor must be active
        if (!newSupervisor.isActive) {
            logWithTime(`❌ New supervisor ${newSupervisorId} is not active ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "New supervisor is not active");
        }

        // New supervisor must be MID_ADMIN or SUPER_ADMIN
        if (newSupervisor.adminType !== AdminType.MID_ADMIN && newSupervisor.adminType !== AdminType.SUPER_ADMIN) {
            logWithTime(`❌ New supervisor must be MID_ADMIN or SUPER_ADMIN ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "New supervisor must be MID_ADMIN or SUPER_ADMIN");
        }

        // Cannot assign self as supervisor
        if (newSupervisor.adminId === targetAdmin.adminId) {
            logWithTime(`❌ Admin cannot be their own supervisor ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "Admin cannot be their own supervisor");
        }

        const oldSupervisorId = targetAdmin.supervisorId;
        const result = await changeSupervisorService(
            targetAdmin,
            actor,
            newSupervisorId === 'null' ? null : newSupervisorId,
            reason,
            device,
            req.requestId
        );

        if (!result.success) {
            logWithTime(`❌ ${result.message} ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, result.message);
        }

        logWithTime(`✅ Supervisor changed for Admin ${targetAdmin.adminId}`);

        // Send notifications to all parties
        const oldSupervisor = oldSupervisorId ? await fetchAdmin(null, null, oldSupervisorId) : null;
        
        // Notify new supervisor if different from actor
        if (newSupervisor.adminId !== actor.adminId) {
            await notifyNewSupervisorAssigned(newSupervisor, result.data.admin, actor);
        }
        
        // Notify target admin about supervisor change
        await notifySupervisorChanged(result.data.admin, oldSupervisor, newSupervisor, actor);
        
        // Notify old supervisor if exists and different from actor
        if (oldSupervisor && oldSupervisor.adminId !== actor.adminId) {
            await notifyOldSupervisorRemoved(oldSupervisor, result.data.admin, newSupervisor, actor);
        }

        return changeSupervisorSuccessResponse(res, result.data.admin, oldSupervisorId, result.data.newSupervisorId);

    } catch (err) {
        if (err.name === 'ValidationError') {
            logWithTime(`⚠️ Validation Error: ${err.message}`);
            return throwBadRequestError(res, err.message);
        }
        logWithTime(`❌ Internal Error in changing supervisor ${getLogIdentifiers(req)}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { changeSupervisor };
