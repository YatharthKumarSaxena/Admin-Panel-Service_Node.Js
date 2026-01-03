const { DB_NAME, DB_URL } = require("./db.config");
const { adminCleanup, activityTrackerCleanup } = require("./cron.config");
const { throwAccessDeniedError, throwConflictError, throwDBResourceNotFoundError, throwInternalServerError, throwInvalidResourceError, throwResourceNotFoundError, throwSessionExpiredError, logMiddlewareError, getLogIdentifiers } = require("./error-handler.configs");
const { adminCreationRequiredFields, adminCreationInBulkRequiredFields } = require("./required-fields.config");
const { emailRegex, mongoIdRegex, customIdRegex, UUID_V4_REGEX, fullPhoneNumberRegex } = require("./regex.config");
const { validationRules, validationSets } = require("./validation.config");

/*
const {  } = require("./rate-limit.config");
const {  } = require("./fields-length.config");
const {  } = require("./server-error-handler.config");
const {  } = require("./server.config");
const {  } = require("./ip-address.config");
const {  } = require("./system.config");
const {  } = require("./token.config");
const {  } = require("./tracker.config");
const {  } = require("./uri.config");

module.exports = {
    validationRules,
    validationSets
}
*/