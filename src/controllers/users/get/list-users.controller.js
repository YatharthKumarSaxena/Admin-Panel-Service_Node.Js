const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { listUsersService } = require("@services/users/get/list-users.service");
const { listUsersSuccessResponse } = require("@/responses/success/index");

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
      query.updatedAt  = {};
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

    // Pagination, sorting options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    };

    // Call service
    const result = await listUsersService(
      query,
      options,
      admin,
      req.device,
      req.requestId
    );

    // Handle service errors
    if (!result.success) {
      return throwInternalServerError(res, result.message);
    }

    return listUsersSuccessResponse(res, result.data.users, result.data.total, page, limit);

  } catch (err) {
    logWithTime(`❌ Error in listUsers controller ${getLogIdentifiers(req)}: ${err.message}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listUsers };
