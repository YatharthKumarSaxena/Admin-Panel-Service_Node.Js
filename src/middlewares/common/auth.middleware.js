const { throwInternalServerError, logMiddlewareError, throwResourceNotFoundError, throwBadRequestError } = require("@utils/error-handler.util");
const { validateEmail } = require("@utils/email-validator.util");
const { validatePhone } = require("@utils/phone-validator.util");
const { AuthModes } = require("@configs/enums.config");

const authModeValidator = async (req, res, next) => {
    try {
        const { email, fullPhoneNumber } = req.body;
        const authMode = process.env.AUTH_MODE || "BOTH";

        if (authMode === AuthModes.EMAIL) {
            // Step 1: Check if email field is provided
            if (!email) {
                logMiddlewareError("authModeValidator", "Missing email field", req);
                return throwResourceNotFoundError(res, "email");
            }

            // Step 2: Validate email format + length
            if (!validateEmail(res, email)) {
                logMiddlewareError("authModeValidator", "Invalid email provided", req);
                return;
            }
            // Remove Full Phone Number if Provided Additionally
            if (fullPhoneNumber) {
                delete req.body.fullPhoneNumber;
            }
        }

        else if (authMode === AuthModes.PHONE) {
            // Step 1: Check if fullPhoneNumber field is provided
            if (!fullPhoneNumber) {
                logMiddlewareError("authModeValidator", "Missing fullPhoneNumber field", req);
                return throwResourceNotFoundError(res, "fullPhoneNumber");
            }

            // Step 2: Validate phone format + length
            if (!validatePhone(res, fullPhoneNumber)) {
                logMiddlewareError("authModeValidator", "Invalid fullPhoneNumber provided", req);
                return
            }
            // Remove Email if Provided Additionally
            if (email) {
                delete req.body.email;
            }
        }

        else if (authMode === AuthModes.BOTH) {
            if(!email || !fullPhoneNumber){
                logMiddlewareError("authModeValidator", "Full Phone Number and Email are required fields", req);
                return throwResourceNotFoundError(res, "email or fullPhoneNumber");
            }

            // Validate Email if Provided
            if(email && !validateEmail(res, email)){
                logMiddlewareError("authModeValidator", "Invalid email provided", req);
                return;
            }

            // Validate Phone if Provided
            if(fullPhoneNumber && !validatePhone(res, fullPhoneNumber)){
                logMiddlewareError("authModeValidator", "Invalid fullPhoneNumber provided", req);
                return;
            }
        }

        else{
            if(!email && !fullPhoneNumber){
                logMiddlewareError("authModeValidator", "Exactly one identifier (Email or Full Phone Number) is required", req);
                return throwResourceNotFoundError(res, "email or fullPhoneNumber");
            }
            if(email && fullPhoneNumber){
                logMiddlewareError("authModeValidator", "Only one identifier (Email or Full Phone Number) should be provided", req);
                return throwBadRequestError(res, "Provide either email or fullPhoneNumber, not both.");
            }
            // Validate Email if Provided
            if(email && !validateEmail(res, email)){
                logMiddlewareError("authModeValidator", "Invalid email provided", req);
                return;
            }
            // Validate Phone if Provided
            if(fullPhoneNumber && !validatePhone(res, fullPhoneNumber)){
                logMiddlewareError("authModeValidator", "Invalid fullPhoneNumber provided", req);
                return;
            }
        }

        return next();

    } catch (error) {
        logMiddlewareError("authModeValidator", "Internal error while validating auth elements", req);
        return throwInternalServerError(res, error);
    }
};

module.exports = {
    authModeValidator
};
