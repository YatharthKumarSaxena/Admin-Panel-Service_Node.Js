// Base path of all APIs (can be changed in one place if needed)
const BASE_PATH = "/admin-panel-service";  

// API versioning (helps us move from /v1 to /v2 easily)
const API_VERSION = "/api/v1"; 

// API Prefix that is Base Path + API Version
const API_PREFIX = `${BASE_PATH}${API_VERSION}`;

/* 
  ⚙️ What is `${}` and `` ?
  - These are part of JavaScript's Template Literals (introduced in ES6).
  - Backticks (``) allow multi-line strings and variable interpolation.
  - `${}` is used to insert variables inside strings dynamically.
*/

// 👇 Defining major base segments once to avoid repetition (DRY Principle)                        
const ADMIN_BASE = `${API_PREFIX}/admin`;                       // /admin-panel-service/api/v1/admin
const USER_BASE = `${API_PREFIX}/users`;                        // /admin-panel-service/api/v1/users
const INTERNAL_BASE = `${API_PREFIX}/internal`                  // /admin-panel-service/api/v1/internal

// 🔁 Exporting all route constants, grouped by modules (Auth, User, Admin, Category)
module.exports = {
    ADMIN_BASE: ADMIN_BASE,
    USER_BASE: USER_BASE,
    INTERNAL_BASE: INTERNAL_BASE,

    // 🛠️ Admin-specific routes (e.g. category creation, update, delete)
    ADMIN_ROUTES: {
        USERS: {
            BLOCK_USER: `/block-user`,              // PATCH /admin-panel-service/api/v1/users/block-user
            UNBLOCK_USER: `/unblock-user`,          // PATCH /admin-panel-service/api/v1/users/unblock-user
            BLOCK_DEVICE: `/block-device`,          // PATCH /admin-panel-service/api/v1/users/block-device
            UNBLOCK_DEVICE: `/unblock-device`,      // PATCH /admin-panel-service/api/v1/users/unblock-device
            GET_USER_ACTIVE_SESSIONS: `/active-sessions`,   // GET /admin-panel-service/api/v1/users/active-sessions
            FETCH_USER_DETAILS: `/fetch-user-details`,       // GET /admin-panel-service/api/v1/users/fetch-user-details
            GET_USER_AUTH_LOGS: `/auth-logs`,  // GET /admin-panel-service/api/v1/users/auth-logs
            GET_TOTAL_REGISTERED_USERS: `/total-users`,      // GET /admin-panel-service/api/v1/users/total-users
            LIST_USERS: `/list`                     // GET /admin-panel-service/api/v1/users/list
        },
        ADMINS: {
            GET_ADMIN_AUTH_LOGS: `/auth-logs`,        // POST /admin-panel-service/api/v1/admin/auth-logs
            UPDATE_ADMIN_ROLE: `/update-role`,      // PATCH /admin-panel-service/api/v1/admin/update-role
            UPDATE_ADMIN_DETAILS: `/update-details`, // PATCH /admin-panel-service/api/v1/admin/update-details
            UPDATE_MY_DETAILS: `/update-my-details`, // PATCH /admin-panel-service/api/v1/admin/update-my-details
            CHANGE_ROLE_REQUEST: `/change-role-request`, // POST /admin-panel-service/api/v1/admin/change-role-request
            APPROVE_ROLE_REQUEST: `/approve-role-request`, // POST /admin-panel-service/api/v1/admin/approve-role-request
            REJECT_ROLE_REQUEST: `/reject-role-request`,   // POST /admin-panel-service/api/v1/admin/reject-role-request
            CREATE_ADMIN: `/create` ,          // POST /admin-panel-service/api/v1/admin/create
            ACTIVATE_ADMIN: `/activate`,         // PATCH /admin-panel-service/api/v1/admin/activate
            DEACTIVATE_ADMIN: `/deactivate`,      // PATCH /admin-panel-service/api/v1/admin/deactivate
            
            // Status Request Routes
            CREATE_DEACTIVATION_REQUEST: `/deactivation-request`,           // POST /admin-panel-service/api/v1/admin/deactivation-request
            LIST_DEACTIVATION_REQUESTS: `/deactivation-requests`,           // GET /admin-panel-service/api/v1/admin/deactivation-requests
            APPROVE_DEACTIVATION_REQUEST: `/deactivation-request/:requestId/approve`,  // POST /admin-panel-service/api/v1/admin/deactivation-request/:requestId/approve
            REJECT_DEACTIVATION_REQUEST: `/deactivation-request/:requestId/reject`,    // POST /admin-panel-service/api/v1/admin/deactivation-request/:requestId/reject
            
            CREATE_ACTIVATION_REQUEST: `/activation-request`,               // POST /admin-panel-service/api/v1/admin/activation-request
            LIST_ACTIVATION_REQUESTS: `/activation-requests`,               // GET /admin-panel-service/api/v1/admin/activation-requests
            APPROVE_ACTIVATION_REQUEST: `/activation-request/:requestId/approve`,      // POST /admin-panel-service/api/v1/admin/activation-request/:requestId/approve
            REJECT_ACTIVATION_REQUEST: `/activation-request/:requestId/reject`,        // POST /admin-panel-service/api/v1/admin/activation-request/:requestId/reject
            
            VIEW_STATUS_REQUEST: `/status-request/:requestId`              // GET /admin-panel-service/api/v1/admin/status-request/:requestId (both activation & deactivation)
         },
        INTERNAL: {
            SYNC_USER_DATA: `/sync-user-data`               // POST /admin-panel-service/api/v1/internal/sync-user-data
        }
    }
}