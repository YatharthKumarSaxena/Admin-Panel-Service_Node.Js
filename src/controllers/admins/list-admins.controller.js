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
      search,         // Search term for email, phone, adminId
      sortBy = 'createdAt',
      sortOrder = 'desc',
      // Date filters
      createdAfter,   // createdAt >= this date
      createdBefore,  // createdAt <= this date
      createdFrom,    // createdAt >= this date (for range)
      createdTo,      // createdAt <= this date (for range)
      updatedAfter,   // updatedAt >= this date
      updatedBefore,  // updatedAt <= this date
      updatedFrom,    // updatedAt >= this date (for range)
      updatedTo,      // updatedAt <= this date (for range)
      // Activation/Deactivation filters
      activatedBy,    // Filter by who activated
      deactivatedBy,  // Filter by who deactivated
      activationReason,   // Search in activation reason
      deactivationReason  // Search in deactivation reason
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

    // 📅 Date filtering for createdAt
    if (createdFrom || createdTo || createdAfter || createdBefore) {
      query.createdAt = {};
      
      // Range filtering (createdFrom to createdTo)
      if (createdFrom) {
        query.createdAt.$gte = new Date(createdFrom);
      }
      if (createdTo) {
        query.createdAt.$lte = new Date(createdTo);
      }
      
      // Individual filtering (after/before)
      if (createdAfter && !createdFrom) {
        query.createdAt.$gte = new Date(createdAfter);
      }
      if (createdBefore && !createdTo) {
        query.createdAt.$lte = new Date(createdBefore);
      }
    }

    // 📅 Date filtering for updatedAt
    if (updatedFrom || updatedTo || updatedAfter || updatedBefore) {
      query.updatedAt = {};
      
      // Range filtering (updatedFrom to updatedTo)
      if (updatedFrom) {
        query.updatedAt.$gte = new Date(updatedFrom);
      }
      if (updatedTo) {
        query.updatedAt.$lte = new Date(updatedTo);
      }
      
      // Individual filtering (after/before)
      if (updatedAfter && !updatedFrom) {
        query.updatedAt.$gte = new Date(updatedAfter);
      }
      if (updatedBefore && !updatedTo) {
        query.updatedAt.$lte = new Date(updatedBefore);
      }
    }

    // 👤 Filter by who activated/deactivated
    if (activatedBy) {
      query.activatedBy = activatedBy;
    }
    if (deactivatedBy) {
      query.deactivatedBy = deactivatedBy;
    }

    // 📝 Search in activation/deactivation reasons
    if (activationReason && activationReason.trim()) {
      query.activatedReason = { $regex: activationReason.trim(), $options: 'i' };
    }
    if (deactivationReason && deactivationReason.trim()) {
      query.deactivatedReason = { $regex: deactivationReason.trim(), $options: 'i' };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query with minimal fields for list view
    const [admins, totalCount] = await Promise.all([
      AdminModel.find(query)
        .select('adminId email fullPhoneNumber adminType isActive createdAt updatedAt supervisorId activatedBy deactivatedBy activatedReason deactivatedReason')
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
        sortOrder: sortOrder,
        dateFilters: {
          createdAt: {
            after: createdAfter || createdFrom || null,
            before: createdBefore || createdTo || null
          },
          updatedAt: {
            after: updatedAfter || updatedFrom || null,
            before: updatedBefore || updatedTo || null
          }
        },
        activationFilters: {
          activatedBy: activatedBy || null,
          deactivatedBy: deactivatedBy || null,
          activationReason: activationReason || null,
          deactivationReason: deactivationReason || null
        }
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
