const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { OK } = require("@configs/http-status.config");
const { AdminType, requestStatus, requestType, viewScope } = require("@configs/enums.config");

/**
 * List All Status Requests Controller
 * Hierarchical + secure list with safe search
 */

const listAllStatusRequests = async (req, res) => {
  try {
    const actor = req.admin;

    const {
      status,
      requestType: reqType,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",

      createdAfter,
      createdBefore,
      createdFrom,
      createdTo,

      updatedAfter,
      updatedBefore,
      updatedFrom,
      updatedTo,

      reviewedAfter,
      reviewedBefore,
      reviewedFrom,
      reviewedTo,

      requestedBy,
      reviewedBy,

      search,
      searchReason,
      searchNotes
    } = req.query;

    /* -------------------- BASE QUERY -------------------- */
    const query = {};
    const andConditions = [];

    /* -------------------- HIERARCHY FILTER -------------------- */
    if (actor.adminType === AdminType.MID_ADMIN) {
      const adminIds = await AdminModel.find(
        { adminType: AdminType.ADMIN },
        { adminId: 1 }
      ).lean();

      query.targetAdminId = { $in: adminIds.map(a => a.adminId) };
    }

    if (actor.adminType === AdminType.ADMIN) {
      query.targetAdminId = actor.adminId;
      query.requestType = requestType.DEACTIVATION;
    }

    /* -------------------- REQUEST TYPE -------------------- */
    if (reqType && Object.values(requestType).includes(reqType.toUpperCase())) {
      if (actor.adminType === AdminType.ADMIN) {
        return res.status(OK).json({
          requests: [],
          pagination: {
            currentPage: +page,
            totalPages: 0,
            totalRecords: 0,
            recordsPerPage: +limit
          },
          note: "Regular admins cannot view activation requests"
        });
      }
      query.requestType = reqType.toUpperCase();
    }

    /* -------------------- STATUS -------------------- */
    if (status && Object.values(requestStatus).includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    /* -------------------- SEARCH (SECURE) -------------------- */
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      andConditions.push({
        $or: [
          { email: regex },
          { fullPhoneNumber: regex },
          { adminId: regex }
        ]
      });
    }

    if (searchReason && searchReason.trim()) {
      andConditions.push({
        reason: { $regex: searchReason.trim(), $options: "i" }
      });
    }

    if (searchNotes && searchNotes.trim()) {
      const regex = new RegExp(searchNotes.trim(), "i");
      andConditions.push({
        $or: [
          { notes: regex },
          { reviewNotes: regex }
        ]
      });
    }

    if (andConditions.length) {
      query.$and = andConditions;
    }

    /* -------------------- DATE FILTERS -------------------- */
    const applyDateFilter = (field, from, to, after, before) => {
      if (from || to || after || before) {
        query[field] = {};
        if (from) query[field].$gte = new Date(from);
        if (to) query[field].$lte = new Date(to);
        if (after && !from) query[field].$gte = new Date(after);
        if (before && !to) query[field].$lte = new Date(before);
      }
    };

    applyDateFilter("createdAt", createdFrom, createdTo, createdAfter, createdBefore);
    applyDateFilter("updatedAt", updatedFrom, updatedTo, updatedAfter, updatedBefore);
    applyDateFilter("reviewedAt", reviewedFrom, reviewedTo, reviewedAfter, reviewedBefore);

    /* -------------------- SIMPLE FILTERS -------------------- */
    if (requestedBy) query.requestedBy = requestedBy;
    if (reviewedBy) query.reviewedBy = reviewedBy;

    /* -------------------- PAGINATION -------------------- */
    const skip = (+page - 1) * +limit;
    const sortObj = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [requests, totalCount] = await Promise.all([
      AdminStatusRequestModel.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(+limit)
        .lean(),
      AdminStatusRequestModel.countDocuments(query)
    ]);

    logWithTime(
      `✅ Status requests fetched by ${actor.adminId} (${actor.adminType}): ${requests.length}/${totalCount}`
    );

    return res.status(OK).json({
      requests,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(totalCount / +limit),
        totalRecords: totalCount,
        recordsPerPage: +limit
      },
      viewScope:
        actor.adminType === AdminType.SUPER_ADMIN
          ? viewScope.ALL
          : actor.adminType === AdminType.MID_ADMIN
          ? viewScope.ADMINS_ONLY
          : viewScope.SELF_ONLY
    });

  } catch (err) {
    logWithTime(`❌ Error fetching status requests: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listAllStatusRequests };
