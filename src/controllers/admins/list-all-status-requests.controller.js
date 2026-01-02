const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { AdminType, requestStatus, requestType, viewScope } = require("@configs/enums.config");

/**
 * List All Status Requests Controller
 * Lists both activation and deactivation requests with filters
 * Hierarchical access based on admin type
 */
const listAllStatusRequests = async (req, res) => {
  try {
    const actor = req.admin;
    const { 
      status,           // Filter by status: PENDING, APPROVED, REJECTED
      requestType: reqType,  // Filter by type: ACTIVATION, DEACTIVATION
      page = 1, 
      limit = 20 
    } = req.query;

    // Build base query
    const query = {};

    // ✅ Apply hierarchical filtering
    if (actor.adminType === AdminType.SUPER_ADMIN) {
      // Super Admin: See ALL requests (both activation & deactivation)
      // No additional filter needed
    } else if (actor.adminType === AdminType.MID_ADMIN) {
      // Mid Admin: See only ADMIN requests (both types)
      const adminIds = await AdminModel.find(
        { adminType: AdminType.ADMIN },
        { adminId: 1 }
      ).lean();
      
      const adminIdList = adminIds.map(admin => admin.adminId);
      query.targetAdminId = { $in: adminIdList };
    } else {
      // Regular ADMIN: See only their own deactivation requests
      // Cannot see activation requests (they're deactivated!)
      query.targetAdminId = actor.adminId;
      query.requestType = requestType.DEACTIVATION;
    }

    // Request Type filter (ACTIVATION or DEACTIVATION)
    if (reqType && Object.values(requestType).includes(reqType.toUpperCase())) {
      // For regular admin, return empty
      if (actor.adminType === AdminType.ADMIN) {
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
      query.requestType = reqType.toUpperCase();
    }

    // Status filter (PENDING, APPROVED, REJECTED)
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

    logWithTime(`✅ Status requests fetched by ${actor.adminId} (${actor.adminType}): ${requests.length}/${totalCount} records`);

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
        requestType: reqType || viewScope.ALL,
        viewScope: actor.adminType === AdminType.SUPER_ADMIN ? viewScope.ALL : 
                   actor.adminType === AdminType.MID_ADMIN ? viewScope.ADMINS_ONLY : viewScope.SELF_ONLY
      }
    });

  } catch (err) {
    logWithTime(`❌ Error fetching status requests: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listAllStatusRequests };
