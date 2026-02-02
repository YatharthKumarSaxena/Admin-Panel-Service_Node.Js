const { validateXLSXFile } = require("@utils/validate-xlsx.util");
const { throwInternalServerError, logMiddlewareError, throwMissingFieldsError } = require("@/responses/common/error-handler.response");
const { logWithTime } = require("@utils/time-stamps.util");

/*
  ✅ Factory pattern middleware:
  Dynamically validates XLSX files for required columns.
  Uses pure validation util and handles response in middleware.
*/

const validateXLSXMiddleware = (requiredFields, middlewareName) => {
  return (req, res, next) => {
    try {
      const file = req.file; // multer.single("file") expected
      const result = validateXLSXFile(file, requiredFields);

      if (!result.valid) {
        logMiddlewareError(middlewareName, "XLSX validation failed", req);
        return throwMissingFieldsError(res, result.missingFields);
      }

      logWithTime(`✅ [${middlewareName}] XLSX file validated successfully`);
      return next();
    } catch (error) {
      logMiddlewareError(middlewareName, "Unexpected error occurred", req);
      return throwInternalServerError(res, error);
    }
  };
};

module.exports = { validateXLSXMiddleware };
