const { throwResourceNotFoundError } = require("./error-handler.util");
const { logWithTime } = require("./time-stamps.util");

const validateRequestBody = (req, requiredFields, res) => {
    // Step 1: Validate request body existence
    if (!req?.body || Object.keys(req.body).length === 0) {
        throwResourceNotFoundError(res, ["Request body is missing"]);
        return false;
    }

    // Step 2: Check missing fields
    const missedFields = requiredFields.filter(field => !req.body[field]);

    if (missedFields.length > 0) {
        throwResourceNotFoundError(res, missedFields);
        return false;
    }

    // Step 3: All good ✅
    logWithTime("✅ [validateRequestBody] All required fields are present");
    return true;
};

module.exports = { validateRequestBody };
