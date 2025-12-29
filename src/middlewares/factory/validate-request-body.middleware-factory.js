const { validateRequestBody } = require("@utils/validate-request-body.util");
const { throwInternalServerError, logMiddlewareError } = require("@utils/error-handler.util");

const validateRequestBodyMiddleware = (requiredFields, middlewareName) => {
    return (req, res, next) => {
        try {
            if (!validateRequestBody(req, requiredFields, res)) {
                logMiddlewareError(middlewareName, "Request body validation failed", req);
                return;
            }
            return next();
        } catch (error) {
            logMiddlewareError(middlewareName, "Unexpected error occurred", req);
            return throwInternalServerError(res, error);
        }

    };
};

module.exports = {
    validateRequestBodyMiddleware
};