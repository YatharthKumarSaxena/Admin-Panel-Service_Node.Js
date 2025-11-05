const { validateXLSXFile } = require("../../utils/validate-xlsx.util");
const { throwInternalServerError, logMiddlewareError } = require("../../configs/error-handler.configs");

/*
  ✅ Factory pattern middleware:
  Dynamically validates XLSX files for required columns.
*/

const validateXLSXMiddleware = (requiredFields) => {
  return (req, res, next) => {
    try {
      const file = req.file; // multer.single("file") expected
      const isValid = validateXLSXFile(file, requiredFields, res);

      if (!isValid) {
        logMiddlewareError("validateXLSXMiddleware", "XLSX validation failed", req);
        return;
      }

      return next();
    } catch (error) {
      logMiddlewareError("validateXLSXMiddleware", "Unexpected error occurred", req);
      return throwInternalServerError(res, error);
    }
  };
};

module.exports = { validateXLSXMiddleware };
