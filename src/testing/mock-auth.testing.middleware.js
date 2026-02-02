const { AdminModel } = require("@models/admin.model");
const { extractAccessToken } = require("@utils/access-token.util");
const { isValidMongoID } = require("@utils/id-validators.util");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwResourceNotFoundError, throwInternalServerError, logMiddlewareError, throwAccessDeniedError } = require("@/responses/common/error-handler.response");

/**
 * 🧪 TESTING MIDDLEWARE - Mock Authentication
 * 
 * For testing purposes when authentication service is not ready.
 * Extracts MongoDB ObjectId from Bearer token and fetches admin directly from DB.
 * 
 * Usage: Replace JWT validation middlewares with this during testing.
 * Token format: Bearer <mongoDbObjectId>
 * 
 * Example: Authorization: Bearer 507f1f77bcf86cd799439011
 * 
 * ⚠️ WARNING: This bypasses all JWT validation. USE ONLY FOR TESTING!
 */

const mockAuthMiddleware = async (req, res, next) => {
    try {
        // Extract token using existing utility
        const token = extractAccessToken(req);

        if (!token) {
            logWithTime("❌ Mock Auth: No token provided");
            return throwResourceNotFoundError(res, "Authentication token required");
        }

        // Validate MongoDB ObjectId format using existing validator
        if (!isValidMongoID(token)) {
            logWithTime(`❌ Mock Auth: Invalid MongoDB ObjectId format: ${token}`);
            logMiddlewareError("mockAuthMiddleware", "Invalid MongoDB ObjectId token", req);
            return throwAccessDeniedError(res, "Invalid MOCK_AUTH_ADMIN_ID format. Must be a valid MongoDB ObjectID");
        }

        // Fetch admin from database using _id
        const admin = await AdminModel.findById(token);

        if (!admin) {
            logWithTime(`❌ Mock Auth: Admin not found for ID - ${token}`);
            return throwAccessDeniedError(res, "Admin not found");
        }

        // Attach admin to request object (mimics real JWT middleware behavior)
        req.admin = admin;
        
        logWithTime(`✅ Mock Auth: Admin ${admin.adminId} (${admin.adminType}) authenticated via MongoDB ID`);
        
        return next();
    } catch (err) {
        logMiddlewareError("mockAuthMiddleware", "Internal Error occurred", req);
        return throwInternalServerError(res, err);
    }
};

module.exports = { mockAuthMiddleware };