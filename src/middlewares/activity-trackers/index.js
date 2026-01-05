const { validationMiddlewares } = require("./field-validation.middleware");
const { validateRequestBodyMiddlewares } = require("./validate-request-body.middleware");

const activityTrackerMiddlewares = {
    ...validationMiddlewares,
    ...validateRequestBodyMiddlewares
};

module.exports = {
    activityTrackerMiddlewares
}