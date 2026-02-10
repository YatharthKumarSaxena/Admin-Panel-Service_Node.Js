const { canActOnRole } = require("@/utils/role.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, throwAccessDeniedError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { notifyAdminDetailsUpdated, notifyDetailsUpdateToSupervisor } = require("@utils/admin-notifications.util");
const { updateAdminRoleService } = require("@/services/admins/update/update-admin-role.service");
const { updateAdminRoleSuccessResponse } = require("@/responses/success/admin.response");
const { AdminType } = require("@configs/enums.config");

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
        const targetAdmin = req.foundAdmin;
        const device = req.device;

        let supervisor = null;
        if (newSupervisorId) {
            supervisor = await fetchAdmin(null, null, newSupervisorId);
            if (!supervisor) {
                logWithTime(`❌ Supervisor not found: ${newSupervisorId} ${getLogIdentifiers(req)}`);
                return throwBadRequestError(res, "Supervisor not found with provided supervisorId");
            }
            if (canActOnRole(supervisor.adminType, newRole) === false) {
                logWithTime(`❌ Supervisor cannot oversee an admin of equal or higher role ${getLogIdentifiers(req)}`);
                return throwBadRequestError(res, "Supervisor cannot oversee an admin of equal or higher role");
            }
        }

        // Check if already has the same role
        if (targetAdmin.adminType === newRole) {
            logWithTime(`⚠️ Admin ${targetAdmin.adminId} already has role ${newRole} ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "Admin already has this role");
        }

        if (targetAdmin.adminType === AdminType.SUPER_ADMIN) {
            logWithTime(`❌ Attempt to change role for Super Admin ${getLogIdentifiers(req)}`);
            return throwAccessDeniedError(res, "Cannot change the role of a Super Admin");
        }

        const valid = canActOnRole(actor.adminType, newRole);
        if (!valid) {
            logWithTime(`❌ Admin ${actor.adminId} cannot assign role ${newRole} ${getLogIdentifiers(req)}`);
            return throwAccessDeniedError(res, "You do not have permission to assign this role");
        }

        const oldRole = targetAdmin.adminType;
        const result = await updateAdminRoleService(
            targetAdmin,
            actor,
            newRole,
            reason,
            device,
            req.requestId
        );

        if (!result.success) {
            logWithTime(`❌ ${result.message} ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, result.message);
        }

        // Notify target admin about role change
        await notifyAdminDetailsUpdated(result.data.admin, actor, { adminType: newRole });
        
        // Notify supervisor about role change
        if (supervisor && actor.adminId !== newSupervisorId) {
            await notifyDetailsUpdateToSupervisor(supervisor, result.data.admin, actor, 'Role Updated');
        }

        logWithTime(`✅ Admin ${targetAdmin.adminId} role updated to ${newRole} by ${actor.adminId}`);

        return updateAdminRoleSuccessResponse(res, result.data.admin, oldRole, newRole);
    } catch (error) {
        logWithTime(`❌ Error updating admin role: ${error.message} ${getLogIdentifiers(req)}`);
        return throwInternalServerError(res, "An error occurred while updating admin role");
    }
};

module.exports = {
    updateAdminRole
};