const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { getUserDetailsService } = require("@services/users/get/get-user-details.service");
const { viewUserDetailsSuccessResponse } = require("@/responses/success/index");

/**
 * View User Details Controller
 * Retrieves comprehensive details of a user
 */

const viewUserDetails = async (req, res) => {
    try {
        const admin = req.admin;
        const { reason } = req.params;

        const targetUser = req.foundUser;

        // Call service
        const result = await getUserDetailsService(
            targetUser,
            admin,
            reason,
            req.device,
            req.requestId
        );

        // Handle service errors
        if (!result.success) {
            return throwInternalServerError(res, result.message);
        }

        // Success response
        return viewUserDetailsSuccessResponse(res, result.data, admin);

    } catch (err) {
        logWithTime(`❌ Internal Error in viewUserDetails controller ${getLogIdentifiers(req)}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { viewUserDetails };
