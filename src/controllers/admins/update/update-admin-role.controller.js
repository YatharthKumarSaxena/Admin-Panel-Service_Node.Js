const { AdminType } = require("@configs/enums.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");
const { OK } = require("@/configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { canActOnRole } = require("@/utils/role.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwAccessDeniedError, throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { notifyAdminDetailsUpdated, notifyDetailsUpdateToSupervisor } = require("@utils/admin-notifications.util");

/**
 * Update Admin Role Controller
 * Allows updating the role of an admin
 * Super Admin can change any admin's role
 * Mid Admin can only change their subordinates' roles to MID_ADMIN
 */

const updateAdminRole = async (req, res) => {
    try {
        const actor = req.admin;
        const { newRole, reason, newSupervisorId } = req.body;

        let supervisor = null;
        if(newSupervisorId){
            supervisor =  await fetchAdmin(null, null, newSupervisorId);
            if(!supervisor){
                logWithTime(`❌ Supervisor not found: ${newSupervisorId} while updating admin role by ${actor.adminId} ${getLogIdentifiers(req)}`);
                return throwBadRequestError(res, "Supervisor not found with provided supervisorId");
            }
            if(canActOnRole(supervisor.adminType, newRole) === false){
                logWithTime(`❌ Supervisor cannot oversee an admin of equal or higher role: ${newSupervisorId} while updating admin role by ${actor.adminId} ${getLogIdentifiers(req)}`);
                return throwBadRequestError(res, "Supervisor cannot oversee an admin of equal or higher role");
            }
        }else{
            logWithTime(`ℹ️ No supervisorId provided while updating admin role by ${actor.adminId} ${getLogIdentifiers(req)}. Defaulting supervisorId to actor.`);
            newSupervisorId = actor.adminId;
        }
        const targetAdmin = req.foundAdmin;

        // Check if already has the same role
        if (targetAdmin.adminType === newRole) {
            logWithTime(`⚠️ Admin ${targetAdmin.adminId} already has role ${newRole} ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "Admin already has this role");
        }

        if (targetAdmin.adminType === AdminType.SUPER_ADMIN) {
            logWithTime(`❌ Attempt to change role for Super Admin ${targetAdmin.adminId} by ${actor.adminId} ${getLogIdentifiers(req)}`);
            return throwAccessDeniedError(res, "Cannot change the role of a Super Admin");
        }

        const valid = canActOnRole(actor.adminType, newRole);

        if (!valid) {
            logWithTime(`❌ Admin ${actor.adminId} with role ${actor.adminType} cannot assign role ${newRole} to admin ${targetAdmin.adminId} ${getLogIdentifiers(req)}`);
            return throwAccessDeniedError(res, "You do not have permission to assign this role");
        }
        
        // Clone entity before changes for audit
        const oldState = cloneForAudit(targetAdmin);

        // Update role
        targetAdmin.adminType = newRole;
        targetAdmin.updatedBy = actor.adminId;

        await targetAdmin.save();

        // Prepare audit data
        const auditData = prepareAuditData({
            actor,
            action: `Updated role of admin ${targetAdmin.adminId} to ${newRole}`,
            oldState,
            newState: targetAdmin,
            reason,
            req
        });

        // Notify target admin about role change
        await notifyAdminDetailsUpdated(targetAdmin, actor, { adminType: newRole });
        
        // Notify supervisor about role change
        if(supervisor && actor.adminId !== newSupervisorId){
            await notifyDetailsUpdateToSupervisor(supervisor, targetAdmin, actor, 'Role Updated');
        }
        
        logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.UPDATE_ADMIN_ROLE, {
            description: `Admin ${targetAdmin.adminId} role changed from ${oldState.adminType} to ${newRole} by ${actor.adminId}`,
            adminActions: {
                targetAdminId: targetAdmin.adminId,
                oldRole: oldState.adminType,
                newRole: newRole,
                reason
            }
        });

        logWithTime(`✅ Admin ${targetAdmin.adminId} role updated to ${newRole} by ${actor.adminId} ${getLogIdentifiers(req)}`);

        return res.status(OK).json({
            message: "Admin role updated successfully",
            admin: {
                adminId: targetAdmin.adminId,
                adminType: targetAdmin.adminType,
                updatedBy: targetAdmin.updatedBy,
                updatedAt: targetAdmin.updatedAt
            }
        });
    } catch (error) {
        logWithTime(`❌ Error updating admin role: ${error.message} ${getLogIdentifiers(req)}`);
        return throwInternalServerError(res, "An error occurred while updating admin role");
    }
};

module.exports = {
    updateAdminRole
};