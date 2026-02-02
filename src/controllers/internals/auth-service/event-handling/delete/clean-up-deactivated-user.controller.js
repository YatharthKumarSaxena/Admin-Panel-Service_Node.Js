const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { errorMessage, throwInternalServerError } = require("@/responses/common/error-handler.response");

const cleanDeactivatedUsers = (req,res) => {
	try {

	} catch (err) {
		logWithTime("❌ Internal Error in deleting blocked users by Auth Service.");
		return throwInternalServerError(res, err);
	}
};


module.exports = { cleanDeactivatedUsers };
