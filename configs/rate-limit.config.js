// 📦 configs/rate-limit.config.js

module.exports = {
    blockUserAccount: {
        maxRequests: 3,              // Prevent misuse
        windowMs: 30 * 60 * 1000     // every 30 minutes
    },
    unblockUserAccount: {
        maxRequests: 3,              // Match with block policy
        windowMs: 30 * 60 * 1000     // every 30 minutes
    },
    getUserAuthLogs: {
        maxRequests: 5,              // Not a frequent query
        windowMs: 30 * 60 * 1000     // every 30 minutes
    },
    fetchUserDetailsByAdmin: {
        maxRequests: 5,
        windowMs: 5 * 60 * 1000      // every 5 minutes
    },
    checkUserDeviceSessions: {
        maxRequests: 5,
        windowMs: 10 * 60 * 1000     // every 10 minutes
    }
};