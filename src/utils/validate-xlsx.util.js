/*
  ✅ DRY + SRP:
  This utility validates uploaded XLSX files for required fields.
  - Ensures file is present.
  - Ensures required columns exist.
*/

const xlsx = require("xlsx");
const { logWithTime } = require("./time-stamps.util");
const { throwResourceNotFoundError } = require("./error-handler.util");

/**
 * Validates uploaded XLSX file for required columns.
 * @param {*} file - The uploaded XLSX file (from multer or similar).
 * @param {*} requiredFields - Array of required column names.
 * @param {*} res - Express response object.
 * @returns {boolean} - Returns true if validation passes, else false.
 */
const validateXLSXFile = (file, requiredFields, res) => {
  try {
    // Case 1: File not provided
    if (!file) {
      logWithTime("⚠️ XLSX File Missing in Request.");
      throwResourceNotFoundError(res, ["xlsxFile"]);
      return false;
    }

    // Read file buffer
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON for easy field access
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

    // If sheet is empty
    if (!jsonData.length) {
      logWithTime("⚠️ XLSX file has no data rows.");
      throwResourceNotFoundError(res, ["rows"]);
      return false;
    }

    // Extract headers (keys from first row)
    const fileFields = Object.keys(jsonData[0]);
    const missingFields = requiredFields.filter(f => !fileFields.includes(f));

    // Case 2: Required field missing
    if (missingFields.length > 0) {
      logWithTime("❌ XLSX Missing Required Columns:");
      console.log(missingFields);
      throwResourceNotFoundError(res, missingFields);
      return false;
    }

    // ✅ All good
    logWithTime("✅ XLSX File Validation Successful.");
    return true;
  } catch (error) {
    logWithTime("💥 XLSX Validation Utility Crashed.");
    console.error(error.message);
    return false;
  }
};

module.exports = { validateXLSXFile };
