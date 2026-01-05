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
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      // Date filters for createdAt
      createdAfter,
      createdBefore,
      createdFrom,
      createdTo,
      // Date filters for updatedAt
      updatedAfter,
      updatedBefore,
      updatedFrom,
      updatedTo,
      // Date filters for reviewedAt
      reviewedAfter,
      reviewedBefore,
      reviewedFrom,
      reviewedTo,
      // Additional filters
      requestedBy,      // Filter by who requested
      reviewedBy,       // Filter by who reviewed
      targetAdminId,    // Filter by target admin
      searchReason,     // Search in reason field
      searchNotes       // Search in notes/reviewNotes
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

    // 📅 Date filtering for createdAt
    if (createdFrom || createdTo || createdAfter || createdBefore) {
      query.createdAt = {};
      if (createdFrom) query.createdAt.$gte = new Date(createdFrom);
      if (createdTo) query.createdAt.$lte = new Date(createdTo);
      if (createdAfter && !createdFrom) query.createdAt.$gte = new Date(createdAfter);
      if (createdBefore && !createdTo) query.createdAt.$lte = new Date(createdBefore);
    }

    // 📅 Date filtering for updatedAt
    if (updatedFrom || updatedTo || updatedAfter || updatedBefore) {
      query.updatedAt = {};
      if (updatedFrom) query.updatedAt.$gte = new Date(updatedFrom);
      if (updatedTo) query.updatedAt.$lte = new Date(updatedTo);
      if (updatedAfter && !updatedFrom) query.updatedAt.$gte = new Date(updatedAfter);
      if (updatedBefore && !updatedTo) query.updatedAt.$lte = new Date(updatedBefore);
    }

    // 📅 Date filtering for reviewedAt
    if (reviewedFrom || reviewedTo || reviewedAfter || reviewedBefore) {
      query.reviewedAt = {};
      if (reviewedFrom) query.reviewedAt.$gte = new Date(reviewedFrom);
      if (reviewedTo) query.reviewedAt.$lte = new Date(reviewedTo);
      if (reviewedAfter && !reviewedFrom) query.reviewedAt.$gte = new Date(reviewedAfter);
      if (reviewedBefore && !reviewedTo) query.reviewedAt.$lte = new Date(reviewedBefore);
    }

    // 👤 Filter by requestedBy
    if (requestedBy) {
      query.requestedBy = requestedBy;
    }

    // 👤 Filter by reviewedBy
    if (reviewedBy) {
      query.reviewedBy = reviewedBy;
    }

    // 🎯 Filter by targetAdminId (if super/mid admin wants to check specific admin)
    if (targetAdminId && actor.adminType !== AdminType.ADMIN) {
      query.targetAdminId = targetAdminId;
    }

    // 🔍 Search in reason or notes
    if (searchReason && searchReason.trim()) {
      query.reason = { $regex: searchReason.trim(), $options: 'i' };
    }
    if (searchNotes && searchNotes.trim()) {
      query.$or = [
        { notes: { $regex: searchNotes.trim(), $options: 'i' } },
        { reviewNotes: { $regex: searchNotes.trim(), $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [requests, totalCount] = await Promise.all([
      AdminStatusRequestModel.find(query)
        .sort(sortObj)
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
        sortBy: sortBy,
        sortOrder: sortOrder,
        requestedBy: requestedBy || null,
        reviewedBy: reviewedBy || null,
        targetAdminId: targetAdminId || null,
        searchReason: searchReason || null,
        searchNotes: searchNotes || null,
        dateFilters: {
          createdAt: {
            after: createdAfter || createdFrom || null,
            before: createdBefore || createdTo || null
          },
          updatedAt: {
            after: updatedAfter || updatedFrom || null,
            before: updatedBefore || updatedTo || null
          },
          reviewedAt: {
            after: reviewedAfter || reviewedFrom || null,
            before: reviewedBefore || reviewedTo || null
          }
        },
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
