/*
  ✅ Pure Validation Function (Industry Standard)
  This utility validates uploaded XLSX files for required fields.
  Returns validation result object, NO response handling.
  Middleware handles logging and HTTP responses.
*/

const xlsx = require("xlsx");

/**
 * Validates uploaded XLSX file for required columns.
 * @param {*} file - The uploaded XLSX file (from multer or similar).
 * @param {*} requiredFields - Array of required column names.
 * @returns {Object} { valid: boolean, missingFields: Array<string>, data: Array, error: string }
 */
const validateXLSXFile = (file, requiredFields) => {
  try {
    // Case 1: File not provided
    if (!file) {
      return {
        valid: false,
        missingFields: ['xlsxFile'],
        data: [],
        error: 'XLSX file missing in request'
      };
    }

    // Read file buffer
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON for easy field access
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

    // If sheet is empty
    if (!jsonData.length) {
      return {
        valid: false,
        missingFields: ['rows'],
        data: [],
        error: 'XLSX file has no data rows'
      };
    }

    // Extract headers (keys from first row)
    const fileFields = Object.keys(jsonData[0]);
    const missingFields = requiredFields.filter(f => !fileFields.includes(f));

    // Case 2: Required field missing
    if (missingFields.length > 0) {
      return {
        valid: false,
        missingFields,
        data: jsonData,
        error: `Missing required columns: ${missingFields.join(', ')}`
      };
    }

    // ✅ All good
    return {
      valid: true,
      missingFields: [],
      data: jsonData,
      error: null
    };
  } catch (error) {
    return {
      valid: false,
      missingFields: [],
      data: [],
      error: `XLSX validation error: ${error.message}`
    };
  }
};

module.exports = { validateXLSXFile };
