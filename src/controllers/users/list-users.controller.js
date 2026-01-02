const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");

/**
 * List Users Controller
 * Returns paginated list of users with filters
 * Access: All admin types (hierarchical access not needed for users)
 */

const listUsers = async (req, res) => {
  try {
    const admin = req.admin;
    const {
      search,           // Search by email or phone
      isBlocked,        // Filter by blocked status: true/false
      isActive,         // Filter by active status: true/false
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Search filter (email or phone)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { email: searchRegex },
        { fullPhoneNumber: searchRegex }
      ];
    }

    // Blocked status filter
    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked === 'true';
    }

    // Active status filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [users, totalCount] = await Promise.all([
      UserModel.find(query)
        .select('userId email fullPhoneNumber isActive isBlocked blockReason createdAt updatedAt')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      UserModel.countDocuments(query)
    ]);

    logWithTime(`✅ Users list fetched by admin ${admin.adminId}: ${users.length}/${totalCount} records`);

    return res.status(OK).json({
      message: "Users list retrieved successfully",
      users: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalRecords: totalCount,
        recordsPerPage: parseInt(limit)
      },
      filters: {
        search: search || null,
        isBlocked: isBlocked || null,
        isActive: isActive || null,
        sortBy: sortBy,
        sortOrder: sortOrder
      },
      accessedBy: admin.adminId
    });

  } catch (err) {
    logWithTime(`❌ Error fetching users list: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listUsers };
