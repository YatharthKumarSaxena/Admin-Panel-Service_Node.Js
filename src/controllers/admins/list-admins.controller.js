const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers, throwAccessDeniedError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { AdminType } = require("@configs/enums.config");

/**
 * List Admins Controller
 * Returns paginated list of admins with hierarchical access control
 */

const listAdmins = async (req, res) => {
  try {
    const actor = req.admin;
    const { 
      page = 1, 
      limit = 20, 
      type,           // Filter by adminType
      status,         // Filter by isActive
      search,         // Search in email/phone/adminId
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // ✅ Hierarchical access control
    const query = {};

    if (actor.adminType === AdminType.SUPER_ADMIN) {
      // Super Admin: Can see ALL admins
    } else if (actor.adminType === AdminType.MID_ADMIN) {
      // Mid Admin: Can only see regular ADMINs
      query.adminType = AdminType.ADMIN;
    } else {
      // Regular ADMIN: Cannot list other admins
      logWithTime(`❌ Admin ${actor.adminId} attempted to list admins without permission ${getLogIdentifiers(req)}`);
      return throwAccessDeniedError(res, "You don't have permission to list admins");
    }

    // Apply filters
    if (type && Object.values(AdminType).includes(type.toUpperCase())) {
      if (actor.adminType === AdminType.SUPER_ADMIN) {
        query.adminType = type.toUpperCase();
      }
    }

    if (status !== undefined) {
      query.isActive = status === 'true';
    }

    if (search && search.trim()) {
      query.$or = [
        { email: { $regex: search.trim(), $options: 'i' } },
        { fullPhoneNumber: { $regex: search.trim(), $options: 'i' } },
        { adminId: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query with minimal fields for list view
    const [admins, totalCount] = await Promise.all([
      AdminModel.find(query)
        .select('adminId email fullPhoneNumber adminType isActive createdAt supervisorId')
        .sort(sortObj)
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      AdminModel.countDocuments(query)
    ]);

    logWithTime(`✅ Admin list fetched by ${actor.adminId} (${actor.adminType}): ${admins.length}/${totalCount} records`);

    return res.status(OK).json({
      message: "Admins retrieved successfully",
      admins: admins,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalRecords: totalCount,
        recordsPerPage: parseInt(limit),
        hasNext: skip + admins.length < totalCount,
        hasPrevious: parseInt(page) > 1
      },
      filters: {
        type: type || null,
        status: status !== undefined ? status : null,
        search: search || null,
        sortBy: sortBy,
        sortOrder: sortOrder
      },
      meta: {
        viewScope: actor.adminType === AdminType.SUPER_ADMIN ? "ALL_ADMINS" : 
                   actor.adminType === AdminType.MID_ADMIN ? "REGULAR_ADMINS" : "NONE",
        fetchedBy: actor.adminId,
        fetchedAt: new Date()
      }
    });

  } catch (err) {
    logWithTime(`❌ Error fetching admin list: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listAdmins };
