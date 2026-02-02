const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
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
      search,           // Search by email, phone, or userId
      isBlocked,        // Filter by blocked status: true/false
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      // Date filters
      createdAfter,
      createdBefore,
      createdFrom,
      createdTo,
      updatedAfter,
      updatedBefore,
      updatedFrom,
      updatedTo,
      blockedAfter,
      blockedBefore,
      blockedFrom,
      blockedTo,
      unblockedAfter,
      unblockedBefore,
      unblockedFrom,
      unblockedTo,
      // Block/Unblock filters
      blockReason,          // Filter by block reason enum
      unblockReason,        // Filter by unblock reason enum
      blockedBy,            // Filter by admin who blocked
      unblockedBy,          // Filter by admin who unblocked
      minBlockCount,        // Minimum block count
      maxBlockCount,        // Maximum block count
      minUnblockCount,      // Minimum unblock count
      maxUnblockCount,      // Maximum unblock count
      searchBlockDetails,   // Search in blockReasonDetails
      searchUnblockDetails  // Search in unblockReasonDetails
    } = req.query;

    // Build query
    const query = {};

    // Search filter (email, phone, or userId)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { email: searchRegex },
        { fullPhoneNumber: searchRegex },
        { userId: searchRegex }
      ];
    }

    // Blocked status filter
    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked === 'true';
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

    // 📅 Date filtering for blockedAt
    if (blockedFrom || blockedTo || blockedAfter || blockedBefore) {
      query.blockedAt = {};
      if (blockedFrom) query.blockedAt.$gte = new Date(blockedFrom);
      if (blockedTo) query.blockedAt.$lte = new Date(blockedTo);
      if (blockedAfter && !blockedFrom) query.blockedAt.$gte = new Date(blockedAfter);
      if (blockedBefore && !blockedTo) query.blockedAt.$lte = new Date(blockedBefore);
    }

    // 📅 Date filtering for unblockedAt
    if (unblockedFrom || unblockedTo || unblockedAfter || unblockedBefore) {
      query.unblockedAt = {};
      if (unblockedFrom) query.unblockedAt.$gte = new Date(unblockedFrom);
      if (unblockedTo) query.unblockedAt.$lte = new Date(unblockedTo);
      if (unblockedAfter && !unblockedFrom) query.unblockedAt.$gte = new Date(unblockedAfter);
      if (unblockedBefore && !unblockedTo) query.unblockedAt.$lte = new Date(unblockedBefore);
    }

    // 🚫 Block reason filter
    if (blockReason) {
      query.blockReason = blockReason.toUpperCase();
    }

    // ✅ Unblock reason filter
    if (unblockReason) {
      query.unblockReason = unblockReason.toUpperCase();
    }

    // 👤 Filter by who blocked/unblocked
    if (blockedBy) {
      query.blockedBy = blockedBy;
    }
    if (unblockedBy) {
      query.unblockedBy = unblockedBy;
    }

    // 🔢 Block count range filters
    if (minBlockCount !== undefined || maxBlockCount !== undefined) {
      query.blockCount = {};
      if (minBlockCount !== undefined) query.blockCount.$gte = parseInt(minBlockCount);
      if (maxBlockCount !== undefined) query.blockCount.$lte = parseInt(maxBlockCount);
    }

    // 🔢 Unblock count range filters
    if (minUnblockCount !== undefined || maxUnblockCount !== undefined) {
      query.unblockCount = {};
      if (minUnblockCount !== undefined) query.unblockCount.$gte = parseInt(minUnblockCount);
      if (maxUnblockCount !== undefined) query.unblockCount.$lte = parseInt(maxUnblockCount);
    }

    // 🔍 Search in block/unblock details
    if (searchBlockDetails && searchBlockDetails.trim()) {
      query.blockReasonDetails = { $regex: searchBlockDetails.trim(), $options: 'i' };
    }
    if (searchUnblockDetails && searchUnblockDetails.trim()) {
      query.unblockReasonDetails = { $regex: searchUnblockDetails.trim(), $options: 'i' };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [users, totalCount] = await Promise.all([
      UserModel.find(query)
        .select('userId email fullPhoneNumber isActive isBlocked blockReason unblockReason blockedBy unblockedBy blockedVia unblockedVia blockCount unblockCount blockedAt unblockedAt createdAt updatedAt')
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
        sortOrder: sortOrder,
        blockFilters: {
          blockReason: blockReason || null,
          unblockReason: unblockReason || null,
          blockedBy: blockedBy || null,
          unblockedBy: unblockedBy || null,
          blockedVia: blockedVia || null,
          unblockedVia: unblockedVia || null,
          blockCountRange: {
            min: minBlockCount || null,
            max: maxBlockCount || null
          },
          unblockCountRange: {
            min: minUnblockCount || null,
            max: maxUnblockCount || null
          },
          searchBlockDetails: searchBlockDetails || null,
          searchUnblockDetails: searchUnblockDetails || null
        },
        dateFilters: {
          createdAt: {
            after: createdAfter || createdFrom || null,
            before: createdBefore || createdTo || null
          },
          updatedAt: {
            after: updatedAfter || updatedFrom || null,
            before: updatedBefore || updatedTo || null
          },
          blockedAt: {
            after: blockedAfter || blockedFrom || null,
            before: blockedBefore || blockedTo || null
          },
          unblockedAt: {
            after: unblockedAfter || unblockedFrom || null,
            before: unblockedBefore || unblockedTo || null
          }
        }
      },
      accessedBy: admin.adminId
    });

  } catch (err) {
    logWithTime(`❌ Error fetching users list: ${err.message} ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listUsers };
