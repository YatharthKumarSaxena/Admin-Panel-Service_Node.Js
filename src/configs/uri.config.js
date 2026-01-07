// Base path of all APIs (can be changed in one place if needed)
const BASE_PATH = "/admin-panel-service";

// API versioning (helps us move from /v1 to /v2 easily)
const API_VERSION = "/api/v1";

// API Prefix that is Base Path + API Version
const API_PREFIX = `${BASE_PATH}${API_VERSION}`;

// 👇 Defining major base segments once to avoid repetition (DRY Principle)                        
const ADMIN_BASE = `${API_PREFIX}/admins`;                       // /admin-panel-service/api/v1/admin
const USER_BASE = `${API_PREFIX}/users`;                        // /admin-panel-service/api/v1/users
const INTERNAL_BASE = `${API_PREFIX}/internals`;                 // /admin-panel-service/api/v1/internals
const REQUEST_BASE = `${API_PREFIX}/requests`;                  // /admin-panel-service/api/v1/requests
const ACTIVITY_TRACKING_BASE = `${API_PREFIX}/activity-tracking`; // /admin-panel-service/api/v1/activity-tracking

// 🔁 Exporting all route constants, grouped by modules (Auth, User, Admin, Category)
module.exports = {
    ADMIN_BASE: ADMIN_BASE,
    USER_BASE: USER_BASE,
    INTERNAL_BASE: INTERNAL_BASE,
    REQUEST_BASE: REQUEST_BASE,
    ACTIVITY_TRACKING_BASE: ACTIVITY_TRACKING_BASE,

    // 🛠️ Admin-specific routes (e.g. category creation, update, delete)
    ADMIN_ROUTES: {

        GET_ADMIN_AUTH_LOGS: `/get-auth-logs`,        // POST /admin-panel-service/api/v1/admin/auth-logs
        UPDATE_ADMIN_ROLE: `/update-role`,      // PATCH /admin-panel-service/api/v1/admin/update-role
        UPDATE_ADMIN_DETAILS: `/update-details`, // PATCH /admin-panel-service/api/v1/admin/update-details
        UPDATE_MY_DETAILS: `/update-my-details`, // PATCH /admin-panel-service/api/v1/admin/update-my-details
        CREATE_ADMIN: `/create`,          // POST /admin-panel-service/api/v1/admin/create
        CREATE_ADMIN_IN_BULK: `/create-admins-in-bulk`,
        ACTIVATE_ADMIN: `/activate`,         // PATCH /admin-panel-service/api/v1/admin/activate
        DEACTIVATE_ADMIN: `/deactivate`,      // PATCH /admin-panel-service/api/v1/admin/deactivate
        CHANGE_SUPERVISOR: `/change-supervisor`,  // PATCH /admin-panel-service/api/v1/admin/change-supervisor                     
        FETCH_ADMIN_DETAILS: `/fetch-details`,   // GET /admin-panel-service/api/v1/admin/fetch-details
        FETCH_ADMINS_LIST: `/list`,               // GET /admin-panel-service/api/v1/admin/list
        VIEW_MY_DETAILS: `/view-my-details`,  // PATCH /admin-panel-service/api/v1/admin/view-my-details
        GET_ADMIN_DASHBOARD_STATS: `/dashboard-stats`  // GET /admin-panel-service/api/v1/admin/dashboard-stats
    },
    
    USER_ROUTES: {
        BLOCK_USER: `/block-user`,              // PATCH /admin-panel-service/api/v1/users/block-user
        UNBLOCK_USER: `/unblock-user`,          // PATCH /admin-panel-service/api/v1/users/unblock-user
        GET_TOTAL_REGISTERED_USERS: `/total-users`,      // GET /admin-panel-service/api/v1/users/total-users
        LIST_USERS: `/list`,                     // GET /admin-panel-service/api/v1/users/list
        VIEW_USER_DETAILS: `/fetch-user-details`       // GET /admin-panel-service/api/v1/users/fetch-user-details
    },
    // 🔒 Internal Service Routes (for service-to-service communication)

    INTERNAL_ROUTES: {
        SYNC_USER_DATA: `/sync-user-data`,
        BLOCK_DEVICE: `/block-device`,
        UNBLOCK_DEVICE: `/unblock-device`,
        GET_USER_ACTIVE_SESSIONS: `/active-sessions`,   // GET /admin-panel-service/api/v1/users/active-sessions
        FETCH_USER_DETAILS: `/fetch-user-details`,       // GET /admin-panel-service/api/v1/users/fetch-user-details
        GET_USER_AUTH_LOGS: `/auth-logs`,  // GET /admin-panel-service/api/v1/users/auth-logs
    },

    REQUEST_ROUTES: {
        LIST_ALL_STATUS_REQUESTS: `/list`,
        VIEW_STATUS_REQUEST: `/status-request/:requestId`,       // GET /admin-panel-service/api/v1/admin/status-request/:requestId (both activation & deactivation)        
        CREATE_DEACTIVATION_REQUEST: `/deactivation-request`,           // POST /admin-panel-service/api/v1/admin/deactivation-request
        APPROVE_DEACTIVATION_REQUEST: `/deactivation-request/:requestId/approve`,  // POST /admin-panel-service/api/v1/admin/deactivation-request/:requestId/approve
        REJECT_DEACTIVATION_REQUEST: `/deactivation-request/:requestId/reject`,    // POST /admin-panel-service/api/v1/admin/deactivation-request/:requestId/reject
        CREATE_ACTIVATION_REQUEST: `/activation-request`,               // POST /admin-panel-service/api/v1/admin/activation-request
        APPROVE_ACTIVATION_REQUEST: `/activation-request/:requestId/approve`,      // POST /admin-panel-service/api/v1/admin/activation-request/:requestId/approve
        REJECT_ACTIVATION_REQUEST: `/activation-request/:requestId/reject`,        // POST /admin-panel-service/api/v1/admin/activation-request/:requestId/reject
    },

    ACTIVITY_TRACKING_ROUTES: {
        FETCH_ACTIVITY_LOGS: `/fetch-logs`,          // POST /admin-panel-service/api/v1/activity-tracking/fetch-logs
        LIST_ACTIVITY_TRACKS: `/list`,      // GET /admin-panel-service/api/v1/activity-tracking/activity-tracks
        FETCH_MY_ACTIVITY_LOGS: `/fetch-my-logs`    // POST /admin-panel-service/api/v1/activity-tracking/fetch-my-logs
    }
}