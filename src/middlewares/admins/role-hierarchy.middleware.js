const { Roles } = require("../../configs/enums.config");
const { logWithTime } = require("../../utils/time-stamps.util");
const { throwAccessDeniedError, throwInternalServerError } = require("../../utils/error-handler.utils");

const hierarchyGuard = (req, res, next) => {
    try {
        const actor = req.admin; // current logged-in admin
        const targetAdminType =
            req?.foundAdmin?.adminType ||
            req?.foundUser?.userType ||
            req?.body?.targetAdminType;

        // 👆 target role (Roles.SUPER_ADMIN / MID_ADMIN / ADMIN / USER)

        if (!actor || !targetAdminType) {
            return throwAccessDeniedError(res, "Actor or target type missing");
        }

        const actorType = actor.adminType;
        let allowed = false;

        switch (actorType) {
            case Roles.SUPER_ADMIN:
                allowed = targetAdminType !== Roles.SUPER_ADMIN;
                break;

            case Roles.MID_ADMIN:
                allowed = (targetAdminType === Roles.ADMIN || targetAdminType === Roles.USER);
                break;

            case Roles.ADMIN:
                allowed = (targetAdminType === Roles.USER);
                break;

            default:
                allowed = false;
        }

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
