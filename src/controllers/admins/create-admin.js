const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { CREATED } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { AdminType } = require("@configs/enums.config");
const { makeAdminId } = require("@services/user-id.service");

const createAdmin = async (req, res) => {
  try {
    const creator = req.admin; // Injected by middleware
    const { fullPhoneNumber, email, adminType, supervisorId } = req.body;

    // Internal API call to Create Admin in Authentication Service can be placed here
    // If Yes we can proceed to create Admin in our DB

    // 🔧 Generate adminId
    const adminId = await makeAdminId(res);

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
    if(adminType === AdminType.ADMIN){
        eventType = ACTIVITY_TRACKER_EVENTS.CREATE_ADMIN;
    }else{
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
        reason: "New admin account creation"
      }
    });

    return res.status(CREATED).json({
      message: `${adminType} created successfully`,
      adminId: newAdmin.adminId,
      createdBy: creator.adminId
    });
  } catch (err) {
    logWithTime(`❌ Internal Error occurred in creating new admin ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { createAdmin };
