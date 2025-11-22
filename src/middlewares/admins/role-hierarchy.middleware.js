const { Roles } = require("../../configs/enums.config");
const { logWithTime } = require("../../utils/time-stamps.util");
const { throwAccessDeniedError, throwInternalServerError } = require("../../utils/error-handler.utils");

const roleHierarchy = {
    [Roles.SUPER_ADMIN]: [Roles.MID_ADMIN, Roles.ADMIN, Roles.USER],
    [Roles.MID_ADMIN]: [Roles.ADMIN, Roles.USER],
    [Roles.ADMIN]: [Roles.USER]
};

const hierarchyGuard = (req, res, next) => {
    try {
        const actor = req.admin; // current logged-in admin
        const targetAdminType =
            req?.foundAdmin?.adminType ||
            req?.foundUser?.userType ||
            req?.body?.targetAdminType;

        if (!actor || !targetAdminType) {
            return throwAccessDeniedError(res, "Actor or target type missing");
        }

        const actorType = actor.adminType;
        const allowedRoles = roleHierarchy[actorType] || [];
        const allowed = allowedRoles.includes(targetAdminType);

        if (!allowed) {
            logWithTime(`🚫 Unauthorized hierarchy operation: ${actorType} -> ${targetAdminType}`);
            return throwAccessDeniedError(
                res,
                `Operation not allowed: ${actorType} cannot act on ${targetAdminType}`
            );
        }

        logWithTime(`✅ Hierarchy check passed: ${actorType} -> ${targetAdminType}`);
        return next();
    } catch (err) {
        logWithTime(`❌ Error in hierarchyGuard middleware`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { hierarchyGuard };
