const { logWithTime } = require("@utils/time-stamps.util");
const { throwBadRequestError, getLogIdentifiers } = require("@utils/error-handler.util");
const { reasonFieldLength, notesFieldLength } = require("@configs/fields-length.config");

/**
 * Validate Status Request Body Middleware
 * Validates reason and notes for activation/deactivation requests
 */
const validateStatusRequestBody = (req, res, next) => {
  try {
    const { reason, notes } = req.body;

    // Validate reason
    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      logWithTime(`⚠️ Missing or invalid reason field ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Reason is required and must be a non-empty string");
    }

    if (reason.length < reasonFieldLength.min || reason.length > reasonFieldLength.max) {
      logWithTime(`⚠️ Invalid reason length ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, `Reason must be between ${reasonFieldLength.min} and ${reasonFieldLength.max} characters`);
    }

    // Validate notes (optional)
    if (notes !== undefined && notes !== null) {
      if (typeof notes !== 'string') {
        logWithTime(`⚠️ Invalid notes field type ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, "Notes must be a string");
      }

      if (notes.length > notesFieldLength.max) {
        logWithTime(`⚠️ Notes too long ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, `Notes must not exceed ${notesFieldLength.max} characters`);
      }
    }

    // Sanitize inputs
    req.body.reason = reason.trim();
    req.body.notes = notes ? notes.trim() : null;

    next();
  } catch (err) {
    logWithTime(`❌ Error in validateStatusRequestBody middleware ${getLogIdentifiers(req)}`);
    return throwBadRequestError(res, err.message);
  }
};

/**
 * Validate Review Request Body Middleware
 * Validates reviewNotes for approve/reject actions
 */
const validateReviewRequestBody = (req, res, next) => {
  try {
    const { reviewNotes } = req.body;

    // reviewNotes is optional
    if (reviewNotes !== undefined && reviewNotes !== null) {
      if (typeof reviewNotes !== 'string') {
        logWithTime(`⚠️ Invalid reviewNotes field type ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, "Review notes must be a string");
      }

      if (reviewNotes.length > notesFieldLength.max) {
        logWithTime(`⚠️ Review notes too long ${getLogIdentifiers(req)}`);
        return throwBadRequestError(res, `Review notes must not exceed ${notesFieldLength.max} characters`);
      }

      req.body.reviewNotes = reviewNotes.trim();
    }

    next();
  } catch (err) {
    logWithTime(`❌ Error in validateReviewRequestBody middleware ${getLogIdentifiers(req)}`);
    return throwBadRequestError(res, err.message);
  }
};

module.exports = {
  validateStatusRequestBody,
  validateReviewRequestBody
};
