const { RoleHierarchy } = require("@configs/enums.config");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwAccessDeniedError, throwInternalServerError } = require("@utils/error-handler.util");
const { canActOnRole } = require("@utils/role.util");

/**
 * Middleware: Hierarchy-based access control using numeric role hierarchy.
 * 
 * Validates that the actor (logged-in admin) can perform operations on the target
 * based on hierarchy values. Actor can ONLY act on roles with STRICTLY LOWER
 * hierarchy values (same level or higher is automatically denied).
 * 
 * Target role can come from:
 * - req.foundAdmin.adminType (for operations on existing admins)
 * - req.body.adminType (for admin creation operations)
 * - req.foundUser.userType (for operations on users)
 * 
 * @middleware
 */
const hierarchyGuard = (req, res, next) => {
    try {
        const actor = req.admin; // current logged-in admin
        const targetAdminType =
            req?.foundAdmin?.adminType ||
            req?.body?.adminType ||
            req?.foundUser?.userType;

        if (!actor || !targetAdminType) {
            return throwAccessDeniedError(res, "Actor or target type missing");
        }

        const actorType = actor.adminType;
        const actorHierarchy = RoleHierarchy[actorType];
        const targetHierarchy = RoleHierarchy[targetAdminType];

        // Use numeric comparison through utility function
        const allowed = canActOnRole(actorType, targetAdminType);

        if (!allowed) {
            logWithTime(
                `🚫 Hierarchy violation: ${actorType}(${actorHierarchy}) -> ${targetAdminType}(${targetHierarchy})`
            );
            return throwAccessDeniedError(
                res,
                `Operation denied: ${actorType} cannot act on ${targetAdminType} (same or higher hierarchy)`
            );
        }

        logWithTime(
            `✅ Hierarchy check passed: ${actorType}(${actorHierarchy}) -> ${targetAdminType}(${targetHierarchy})`
        );
        return next();
    } catch (err) {
        logWithTime(`❌ Error in hierarchyGuard middleware: ${err.message}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { hierarchyGuard };
