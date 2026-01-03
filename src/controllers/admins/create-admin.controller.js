const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwConflictError } = require("@utils/error-handler.util");
const { CREATED } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType } = require("@configs/enums.config");
const { makeAdminId } = require("@services/user-id.service");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { rollbackAdminCounter } = require("@services/counter-rollback.service");

const createAdmin = async (req, res) => {
  try {
    const creator = req.admin; // Injected by middleware
    const { fullPhoneNumber, email, adminType, supervisorId } = req.body;

    const adminExists = await fetchAdmin(email, fullPhoneNumber);

    if (adminExists) {
      logWithTime(`❌ Duplicate admin creation attempt detected by ${creator.adminId} ${getLogIdentifiers(req)}`);
      return throwConflictError(res, "Admin with provided email/phone already exists", "Please enter unique email/phone number");
    }

    // 🔧 Generate adminId
    const adminId = await makeAdminId();

    if (adminId === "") {
      logWithTime(`❌ Failed to generate adminId for new admin by ${creator.adminId} ${getLogIdentifiers(req)}`);
      return throwInternalServerError(res, "Failed to generate Admin ID. Please try again later.");
    }

    if(adminId === "0"){
      logWithTime(`⚠️ Admin Data Capacity full. Cannot create new admin by ${creator.adminId} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Admin Data Capacity full. Cannot create new admin.");
    }

    // Internal API call to Create Admin in Authentication Service can be placed here
    // If Yes we can proceed to create Admin in our DB

    // If Auth Service call fails, handle the error accordingly
    // First decrease the adminId counter to avoid gaps (if needed)

    // 🧩 Create admin document
    const newAdmin = new AdminModel({
      fullPhoneNumber,
      email,
      adminId,
      adminType,
      supervisorId,
      createdBy: creator.adminId
    });

    await newAdmin.save();

    logWithTime(`✅ New admin created: ${newAdmin.adminId} (${adminType}) by ${creator.adminId}`);

    // ⚙️ Determine event type based on role
    let eventType;
    if (adminType === AdminType.ADMIN) {
      eventType = ACTIVITY_TRACKER_EVENTS.CREATE_ADMIN;
    } else {
      eventType = ACTIVITY_TRACKER_EVENTS.CREATE_MID_ADMIN;
    }

    // 🚀 Fire-and-Forget Activity Log
    logActivityTrackerEvent(req, eventType, {
      description: `New ${adminType} (${newAdmin.adminId}) created by ${creator.adminId}`,
      adminActions: {
        targetUserId: newAdmin.adminId,
        targetUserDetails: {
          email: newAdmin.email,
          fullPhoneNumber: newAdmin.fullPhoneNumber
        },
        reason: req.body?.reason?.trim() || "New admin account creation"
      }
    });

    return res.status(CREATED).json({
      message: `${adminType} created successfully`,
      adminId: newAdmin.adminId,
      createdBy: creator.adminId
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error occurred in creating new admin ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { createAdmin };
