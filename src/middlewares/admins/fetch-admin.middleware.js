const { fetchEntityFactory } = require("@middlewares/factory/fetch-entity.middleware-factory");
const { fetchAdmin } = require("@/services/common/fetch-user.util");

/**
 * CASE 1: LOGIN / GET DETAILS
 * Ye check karega ki Admin EXIST karta hai.
 * Agar nahi mila -> 404 Error throw karega.
 * Use: Login, Forgot Password, Get Profile
 */
const ensureAdminExists = fetchEntityFactory(fetchAdmin, "Admin", true);

/**
 * CASE 2: REGISTRATION
 * Ye check karega ki Admin EXIST NAHI karta.
 * Agar mil gaya -> 409 Conflict Error throw karega.
 * Use: Sign Up, Create Admin
 */
const ensureAdminNew = fetchEntityFactory(fetchAdmin, "Admin", false);

module.exports = { 
    ensureAdminExists, 
    ensureAdminNew 
};