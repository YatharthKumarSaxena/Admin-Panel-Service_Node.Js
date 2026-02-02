const { listAdminsService } = require("@services/admins/get/list-admins.service");
const { logWithTime } = require("@utils/time-stamps.util");
const { 
  throwInternalServerError, 
  getLogIdentifiers, 
  throwAccessDeniedError 
} = require("@/responses/common/error-handler.response");
const { listAdminsSuccessResponse } = require("@/responses/success/index");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * List Admins Controller
 * Returns paginated list of admins with hierarchical access control
 */

const listAdmins = async (req, res) => {
  try {
    const actor = req.admin;
    const filters = req.query;

    // Call service
    const result = await listAdminsService(actor, filters);

    // Handle service errors
    if (!result.success) {
      if (result.type === AdminErrorTypes.UNAUTHORIZED) {
        return throwAccessDeniedError(res, result.message);
      }
      return throwInternalServerError(res, result.message);
    }

    // Success response
    return listAdminsSuccessResponse(
      res, 
      result.data.admins, 
      result.data.totalCount, 
      result.data.page, 
      result.data.limit
    );

  } catch (err) {
    logWithTime(`❌ Error in listAdmins controller ${getLogIdentifiers(req)}: ${err.message}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listAdmins };