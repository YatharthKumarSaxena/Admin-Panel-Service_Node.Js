const { AdminModel } = require("../../models/admin.model");
const { logWithTime } = require("../../utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("../../configs/activity-tracker.config");
const { errorMessage, throwInternalServerError, getLogIdentifiers } = require("../../configs/error-handler.configs");
const { CREATED } = require("../../configs/http-status.config");
const { logActivityTrackerEvent } = require("../../utils/activity-tracker.util");
const { nanoid } = require("nanoid");
const { AdminType } = require("../../configs/enums.config");

const createAdmin = async (req, res) => {
  try {
    const creator = req.admin; // Injected by middleware
    const { fullPhoneNumber, emailId, adminType, supervisorId } = req.body;

    // 🔧 Generate adminId
    const adminId = `adm_${nanoid(10)}`;

    // 🧩 Create admin document
    const newAdmin = new AdminModel({
      fullPhoneNumber,
      emailId,
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
          emailId: newAdmin.emailId,
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
    errorMessage(err);
    return throwInternalServerError(res);
  }
};

module.exports = { createAdmin };
