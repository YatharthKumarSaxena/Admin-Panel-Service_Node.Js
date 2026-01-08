// 📦 configs/rate-limit.config.js

module.exports = {
    config: {
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
        },
        malformedRequest: {
            maxRequests: 3,
            windowMs: 15 * 1000          // every 15 seconds
        },
        unknownRoute: {
            maxRequests: 5,
            windowMs: 60 * 1000          // every 60 seconds
        },
        // Device Management Rate Limits
        getDeviceDetails: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        listDevices: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        blockDevice: {
            maxRequests: 3,              // Prevent misuse
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        unblockDevice: {
            maxRequests: 3,              // Match with block policy
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        createDevice: {
            maxRequests: 5,
            windowMs: 10 * 60 * 1000     // every 10 minutes
        },
        updateDevice: {
            maxRequests: 5,
            windowMs: 10 * 60 * 1000     // every 10 minutes
        },
        deleteDevice: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        deactivateDevice: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        }
    }
};