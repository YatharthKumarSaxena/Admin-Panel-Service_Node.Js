const { validateRequestBody } = require("../../utils/validate-request-body.util");
const { throwInternalServerError, logMiddlewareError } = require("../../configs/error-handler.configs");

const validateRequestBodyMiddleware = (requiredFields) => {
    return (req, res, next) => {
        try {
            if (!validateRequestBody(req, requiredFields, res)) {
                logMiddlewareError("validateRequestBodyMiddleware", "Request body validation failed", req);
                return;
            }
            return next();
        } catch (error) {
            logMiddlewareError("validateRequestBodyMiddleware", "Unexpected error occurred", req);
            return throwInternalServerError(res, error);
        }

    };
};

module.exports = {
    validateRequestBodyMiddleware
};