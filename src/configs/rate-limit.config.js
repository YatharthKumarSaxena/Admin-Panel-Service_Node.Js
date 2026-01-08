// 📦 configs/rate-limit.config.js

module.exports = {
    config: {
        // ========== 🚫 GLOBAL RATE LIMITS ==========
        malformedRequest: {
            maxRequests: 3,
            windowMs: 15 * 1000          // every 15 seconds
        },
        unknownRoute: {
            maxRequests: 5,
            windowMs: 60 * 1000          // every 60 seconds
        },

        // ========== 👥 USER ROUTES RATE LIMITS ==========
        blockUser: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        unblockUser: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        getTotalRegisteredUsers: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        listUsers: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        viewUserDetails: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },

        // ========== 👑 ADMIN ROUTES RATE LIMITS ==========
        getAdminAuthLogs: {
            maxRequests: 5,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        updateAdminRole: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        updateAdminDetails: {
            maxRequests: 5,
            windowMs: 10 * 60 * 1000     // every 10 minutes
        },
        updateMyDetails: {
            maxRequests: 5,
            windowMs: 10 * 60 * 1000     // every 10 minutes
        },
        createAdmin: {
            maxRequests: 5,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        createAdminInBulk: {
            maxRequests: 2,
            windowMs: 60 * 60 * 1000     // every 60 minutes
        },
        activateAdmin: {
            maxRequests: 5,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        deactivateAdmin: {
            maxRequests: 5,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        changeSupervisor: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        fetchAdminDetails: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        fetchAdminsList: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        viewMyDetails: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        getAdminDashboardStats: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },

        // ========== 🔒 INTERNAL ROUTES RATE LIMITS ==========
        syncUserData: {
            maxRequests: 20,
            windowMs: 5 * 60 * 1000      // every 5 minutes (frequent sync)
        },
        syncDeviceData: {
            maxRequests: 20,
            windowMs: 5 * 60 * 1000      // every 5 minutes (frequent sync)
        },
        getUserActiveSessions: {
            maxRequests: 10,
            windowMs: 10 * 60 * 1000     // every 10 minutes
        },
        fetchUserDetailsByInternal: {
            maxRequests: 15,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        getUserAuthLogsByInternal: {
            maxRequests: 10,
            windowMs: 10 * 60 * 1000     // every 10 minutes
        },

        // ========== 🔄 REQUEST ROUTES RATE LIMITS ==========
        listAllStatusRequests: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        viewStatusRequest: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        createDeactivationRequest: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        approveDeactivationRequest: {
            maxRequests: 5,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        rejectDeactivationRequest: {
            maxRequests: 5,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        createActivationRequest: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        approveActivationRequest: {
            maxRequests: 5,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        rejectActivationRequest: {
            maxRequests: 5,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },

        // ========== 📱 DEVICE ROUTES RATE LIMITS ==========
        viewDeviceDetails: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        listDevices: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        blockDevice: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },
        unblockDevice: {
            maxRequests: 3,
            windowMs: 30 * 60 * 1000     // every 30 minutes
        },

        // ========== 📊 ACTIVITY TRACKING ROUTES RATE LIMITS ==========
        fetchActivityLogs: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        listActivityTracks: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        },
        fetchMyActivityLogs: {
            maxRequests: 10,
            windowMs: 5 * 60 * 1000      // every 5 minutes
        }
    }
};