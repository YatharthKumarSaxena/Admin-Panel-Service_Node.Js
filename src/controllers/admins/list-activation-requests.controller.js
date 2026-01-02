const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { AdminType, requestStatus, requestType, viewScope } = require("@configs/enums.config");

/**
 * List Activation Requests Controller
 * Hierarchical access based on admin type
 */
const listActivationRequests = async (req, res) => {
  try {
    const actor = req.admin;
    const { status, page = 1, limit = 20 } = req.query;

    // Build base query
    const query = { requestType: requestType.ACTIVATION };

    // ✅ Apply hierarchical filtering
    if (actor.adminType === AdminType.SUPER_ADMIN) {
      // Super Admin: See ALL requests
      // No additional filter needed
    } else if (actor.adminType === AdminType.MID_ADMIN) {
      // Mid Admin: See only ADMIN requests
      const adminIds = await AdminModel.find(
        { adminType: AdminType.ADMIN },
        { adminId: 1 }
      ).lean();
      
      const adminIdList = adminIds.map(admin => admin.adminId);
      query.targetAdminId = { $in: adminIdList };
    } else {
      // Regular ADMIN: Cannot see activation requests (they're deactivated!)
      // Return empty list
      return res.status(OK).json({
        requests: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalRecords: 0,
          recordsPerPage: parseInt(limit)
        },
        note: "Regular admins cannot view activation requests"
      });
    }

    // Status filter
    if (status && Object.values(requestStatus).includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, totalCount] = await Promise.all([
      AdminStatusRequestModel.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      AdminStatusRequestModel.countDocuments(query)
    ]);

    logWithTime(`✅ Activation requests fetched by ${actor.adminId} (${actor.adminType}): ${requests.length}/${totalCount} records`);

    return res.status(OK).json({
      requests: requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalRecords: totalCount,
        recordsPerPage: parseInt(limit)
      },
      filters: {
        status: status || viewScope.ALL,
        viewScope: actor.adminType === AdminType.SUPER_ADMIN ? viewScope.ALL : viewScope.ADMINS_ONLY
      }
    });

  } catch (err) {
    logWithTime(`❌ Error fetching activation requests: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listActivationRequests };