const { validateXLSXFile } = require("@utils/validate-xlsx.util");
const { throwInternalServerError, logMiddlewareError } = require("@utils/error-handler.util");

/*
  ✅ Factory pattern middleware:
  Dynamically validates XLSX files for required columns.
*/

const validateXLSXMiddleware = (requiredFields, middlewareName) => {
  return (req, res, next) => {
    try {
      const file = req.file; // multer.single("file") expected
      const isValid = validateXLSXFile(file, requiredFields, res);

      if (!isValid) {
        logMiddlewareError(middlewareName, "XLSX validation failed", req);
        return;
      }

      return next();
    } catch (error) {
      logMiddlewareError(middlewareName, "Unexpected error occurred", req);
      return throwInternalServerError(res, error);
    }
  };
};

module.exports = { validateXLSXMiddleware };
