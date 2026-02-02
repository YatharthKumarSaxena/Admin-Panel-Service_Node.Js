// LIST ADMINS SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { AdminType, AdminErrorTypes } = require("@configs/enums.config");

/**
 * List Admins Service
 * @param {Object} actorAdmin - The admin requesting the list
 * @param {Object} filters - Filter parameters {page, limit, type, status, search, sortBy, sortOrder, etc.}
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const listAdminsService = async (actorAdmin, filters) => {
    try {
        const {
            page = 1,
            limit = 20,
            type,
            status,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            createdAfter,
            createdBefore,
            activatedBy,
            deactivatedBy
        } = filters;

        // Build query based on actor's permissions
        const query = {};

        // Hierarchical access control
        if (actorAdmin.adminType === AdminType.SUPER_ADMIN) {
            // Super Admin: Can see ALL admins
        } else if (actorAdmin.adminType === AdminType.MID_ADMIN) {
            // Mid Admin: Can only see regular ADMINs
            query.adminType = AdminType.ADMIN;
        } else {
            // Regular ADMIN: Cannot list other admins
            return {
                success: false,
                type: AdminErrorTypes.UNAUTHORIZED,
                message: "You don't have permission to list admins"
            };
        }

        // Apply filters
        if (type) query.adminType = type;
        if (status !== undefined) query.isActive = status === 'active';
        if (search) {
            query.$or = [
                { adminId: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } }
            ];
        }
        if (createdAfter) query.createdAt = { ...query.createdAt, $gte: new Date(createdAfter) };
        if (createdBefore) query.createdAt = { ...query.createdAt, $lte: new Date(createdBefore) };
        if (activatedBy) query.activatedBy = activatedBy;
        if (deactivatedBy) query.deactivatedBy = deactivatedBy;

        // Pagination
        const parsedLimit = Math.min(parseInt(limit) || 20, 100);
        const parsedPage = Math.max(parseInt(page) || 1, 1);
        const skip = (parsedPage - 1) * parsedLimit;

        // Execute query
        const [admins, totalCount] = await Promise.all([
            AdminModel.find(query)
                .select('-__v')
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(parsedLimit)
                .lean(),
            AdminModel.countDocuments(query)
        ]);

        return {
            success: true,
            data: {
                admins,
                totalCount,
                page: parsedPage,
                limit: parsedLimit
            }
        };

    } catch (error) {
        logWithTime(`❌ List admins service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { listAdminsService };
