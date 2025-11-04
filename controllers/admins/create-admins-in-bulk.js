// controllers/admin/bulk-admin-create.controller.js

const { AdminModel } = require("../../models/admin.model");
const { logWithTime } = require("../../utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("../../configs/activity-tracker.config");
const { CREATED } = require("../../configs/http-status.config");
const { logActivityTrackerEvent } = require("../../utils/activity-tracker.util");
const { errorMessage, throwInternalServerError, getLogIdentifiers } = require("../../configs/error-handler.configs");
const { AdminType } = require("../../configs/enums.config");
const { makeAdminId } = require("../../services/user-id.service");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const bulkAdminCreate = async (req, res) => {
  try {
    const creator = req.admin; // Injected by auth middleware
    const rows = req.validatedRows || [];

    // ⚙️ Counters
    let createdCount = 0;
    let invalidCount = 0;
    let notApplicableCount = 0;

    // 📊 Final report rows (for Excel output)
    const reportRows = [];

    // 🚀 Process each row
    for (const row of rows) {
      const { status, emailId, fullPhoneNumber, adminType, supervisorId, reason } = row;

      const report = {
        emailId,
        fullPhoneNumber,
        adminType,
        supervisorId,
        initialStatus: status,
        finalStatus: "",
        reason: reason || "-",
      };

      // Invalid rows
      if (status === "Invalid") {
        invalidCount++;
        report.finalStatus = "Invalid";
        report.reason = reason || "Invalid data";
        reportRows.push(report);
        continue;
      }

      // NotApplicable rows
      if (status === "NotApplicable") {
        notApplicableCount++;
        report.finalStatus = "NotApplicable";
        report.reason = reason || "Not applicable for this role";
        reportRows.push(report);
        continue;
      }

      // Role Restriction
      if (
        creator.adminType === AdminType.MID_ADMIN &&
        adminType !== AdminType.ADMIN
      ) {
        notApplicableCount++;
        report.finalStatus = "Forbidden";
        report.reason = `Mid Admin cannot create ${adminType}`;
        reportRows.push(report);
        continue;
      }

      // 🔧 Generate adminId
      const adminId = await makeAdminId(res);

      const newAdmin = new AdminModel({
        fullPhoneNumber,
        emailId,
        adminId,
        adminType,
        supervisorId,
        createdBy: creator.adminId,
      });

      await newAdmin.save();
      createdCount++;

      report.finalStatus = "Created";
      report.reason = "-";
      report.createdAdminId = adminId;
      reportRows.push(report);

      logWithTime(`✅ Bulk admin created: ${newAdmin.adminId} (${adminType}) by ${creator.adminId}`);

      // 🎯 Determine event type
      const eventType =
        adminType === AdminType.ADMIN
          ? ACTIVITY_TRACKER_EVENTS.CREATE_ADMIN
          : ACTIVITY_TRACKER_EVENTS.CREATE_MID_ADMIN;

      // 🧩 Fire-and-forget activity log
      logActivityTrackerEvent(req, eventType, {
        description: `Bulk creation: ${adminType} (${newAdmin.adminId}) created by ${creator.adminId}`,
        adminActions: {
          targetUserId: newAdmin.adminId,
          targetUserDetails: {
            emailId: newAdmin.emailId,
            fullPhoneNumber: newAdmin.fullPhoneNumber,
          },
          reason: "Bulk admin creation",
        },
      });
    }

    // 📁 Generate Excel Report
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(reportRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "BulkCreationReport");

    // 🧾 Define output path
    const fileName = `bulk_admin_report_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, `../../temp/${fileName}`);

    // Ensure temp directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    XLSX.writeFile(workbook, filePath);

    logWithTime(`📄 Bulk admin report generated: ${fileName}`);

    // ✅ Final Response
    return res.status(CREATED).json({
      message: "Bulk admin creation completed successfully",
      summary: {
        created: createdCount,
        invalid: invalidCount,
        notApplicable: notApplicableCount,
        totalProcessed: rows.length,
        createdBy: creator.adminId,
      },
      downloadPath: `/temp/${fileName}`, // serve from static or S3 in prod
    });
  } catch (err) {
    logWithTime(`❌ Internal Error occurred during bulk admin creation ${getLogIdentifiers(req)}`);
    errorMessage(err);
    return throwInternalServerError(res);
  }
};

module.exports = { bulkAdminCreate };
