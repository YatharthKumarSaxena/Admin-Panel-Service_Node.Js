const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwAccessDeniedError, throwDBResourceNotFoundError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType } = require("@configs/enums.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

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

        // Super Admin cannot have a supervisor
        if (targetAdmin.adminType === AdminType.SUPER_ADMIN) {
            logWithTime(`❌ Attempt to change supervisor for Super Admin ${targetAdmin.adminId} by ${actor.adminId} ${getLogIdentifiers(req)}`);
            return throwAccessDeniedError(res, "Super Admin cannot have a supervisor");
        }

        // Check if already has the same supervisor
        if (targetAdmin.supervisorId === newSupervisorId) {
            logWithTime(`⚠️ Admin ${targetAdmin.adminId} already has supervisor ${newSupervisorId} ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "Admin already has this supervisor");
        }

        // Clone entity before changes for audit
        const oldState = cloneForAudit(targetAdmin);

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
            logWithTime(`❌ New supervisor ${newSupervisorId} is not MID_ADMIN or SUPER_ADMIN ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "New supervisor must be MID_ADMIN or SUPER_ADMIN");
        }

        // Cannot assign self as supervisor
        if (newSupervisor.adminId === targetAdmin.adminId) {
            logWithTime(`❌ Admin ${targetAdmin.adminId} cannot be their own supervisor ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "Admin cannot be their own supervisor");
        }

        // Update supervisor
        const oldSupervisorId = targetAdmin.supervisorId;
        targetAdmin.supervisorId = newSupervisorId === 'null' ? null : newSupervisorId;
        targetAdmin.updatedBy = actor.adminId;

        await targetAdmin.save();

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldState, targetAdmin);

        logWithTime(`✅ Supervisor changed for Admin ${targetAdmin.adminId} (${targetAdmin.adminType}) from ${oldSupervisorId || 'none'} to ${newSupervisorId || 'none'} by ${actor.adminId}`);

        // Determine event type
        const eventType = targetAdmin.adminType === AdminType.MID_ADMIN
            ? ACTIVITY_TRACKER_EVENTS.CHANGE_MID_ADMIN_SUPERVISOR
            : ACTIVITY_TRACKER_EVENTS.CHANGE_ADMIN_SUPERVISOR;

        // Log activity with audit data
        logActivityTrackerEvent(req, eventType, {
            description: `Supervisor changed for Admin ${targetAdmin.adminId} (${targetAdmin.adminType}) by ${actor.adminId}`,
            adminActions: {
                targetAdminId: targetAdmin.adminId,
                targetAdminDetails: {
                    adminId: targetAdmin.adminId,
                    email: targetAdmin.email,
                    fullPhoneNumber: targetAdmin.fullPhoneNumber,
                    adminType: targetAdmin.adminType
                },
                reason: reason,
                oldData,
                newData
            }
        });

        return res.status(OK).json({
            message: `Supervisor changed successfully for ${targetAdmin.adminType}`,
            adminId: targetAdmin.adminId,
            oldSupervisorId: oldSupervisorId || null,
            newSupervisorId: newSupervisorId === 'null' ? null : newSupervisorId,
            changedBy: actor.adminId
        });

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
