const { fetchEntityFactory } = require("@middlewares/factory/fetch-entity.middleware-factory");
const { fetchAdmin } = require("@utils/fetch-admin.util");

/**
 * 🔍 Fetch Admin Middleware
 * 
 * Strict validation: Validates identifiers based on AuthMode and fetches admin from database
 * - Rejects if both email and fullPhoneNumber are sent (except in BOTH mode)
 * - Rejects if extra identifiers are sent
 * - Validates according to DEFAULT_AUTH_MODE
 * - Attaches foundAdmin to req.foundAdmin
 * 
 * @example
 * router.post('/some-route', fetchAdminMiddleware, controller)
 * // Controller mein: req.foundAdmin available hoga
 */
const fetchAdminMiddleware = fetchEntityFactory(fetchAdmin, "Admin");

module.exports = { fetchAdminMiddleware };
