// controllers/admin/bulk-admin-create.controller.js

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { CREATED } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { AdminType } = require("@configs/enums.config");
const { makeAdminId } = require("@services/user-id.service");
const { fetchAdmin } = require("@/utils/fetch-admin.util"); 
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const bulkAdminCreate = async (req, res) => {
  try {
    const creator = req.admin;
    const rows = req.validatedRows || []; 

    let createdCount = 0;
    let invalidCount = 0;
    let notApplicableCount = 0;
    let errorCount = 0;
    let abortedCount = 0; // 🆕 Track rows that were stopped

    const reportRows = [];

    // 🚀 Process each row sequentially
    for (const row of rows) {
      try {
        const { status, email, fullPhoneNumber, adminType, supervisorId, reason } = row;

        const report = {
          email: email || "-",
          fullPhoneNumber: fullPhoneNumber || "-",
          adminType: adminType || "-",
          supervisorId: supervisorId || "-",
          initialStatus: status,
          finalStatus: "",
          reason: reason || "-",
        };

        // 1. Skip Pre-flagged Invalid rows
        if (status === "Invalid") {
          invalidCount++;
          report.finalStatus = "Invalid";
          report.reason = reason || "Invalid data format";
          reportRows.push(report);
          continue;
        }

        // 2. Skip Pre-flagged NotApplicable rows
        if (status === "NotApplicable") {
          notApplicableCount++;
          report.finalStatus = "NotApplicable";
          report.reason = reason || "Role not applicable";
          reportRows.push(report);
          continue;
        }

        // 3. Permission Check
        if (
          creator.adminType === AdminType.MID_ADMIN &&
          adminType !== AdminType.MID_ADMIN 
        ) {
          notApplicableCount++;
          report.finalStatus = "Forbidden";
          report.reason = `Mid Admin cannot create ${adminType}`;
          reportRows.push(report);
          continue;
        }

        // 4. Duplicate Check
        const exists = await fetchAdmin(email, fullPhoneNumber);

        if (exists) {
          notApplicableCount++;
          report.finalStatus = "Exists";
          report.reason = "Email or Phone already exists";
          reportRows.push(report);
          logWithTime(`⚠️ Skipping. Admin exists: ${email || fullPhoneNumber}`);
          continue;
        }

        // 5. Generate adminId
        const adminId = await makeAdminId();

        // Case A: Technical Failure (Try next row)
        if (adminId === "") {
          errorCount++;
          report.finalStatus = "Failed";
          report.reason = "ID Gen Failed (Technical)";
          reportRows.push(report);
          logWithTime(`🛑 Row Skip: ID generation failed for ${email}`);
          continue;
        }

        // Case B: Capacity Full (STOP EVERYTHING)
        if (adminId === "0") {
          errorCount++;
          report.finalStatus = "Failed";
          report.reason = "Server Capacity Full"; // Ye current row fail hui
          reportRows.push(report);
          
          logWithTime(`🛑 Bulk ABORT: Capacity reached at ${email}. Stopping batch.`);
          
          // ⚠️ BREAK the loop immediately
          break; 
        }

        // 6. Save to DB
        const newAdmin = new AdminModel({
          fullPhoneNumber,
          email,
          adminId,
          adminType,
          supervisorId: supervisorId || null,
          createdBy: creator.adminId,
        });

        await newAdmin.save();
        createdCount++;

        // 7. Success Report
        report.finalStatus = "Created";
        report.reason = "Success";
        report.createdAdminId = adminId;
        reportRows.push(report);

        // 8. Activity Log
        const eventType =
          adminType === AdminType.ADMIN
            ? ACTIVITY_TRACKER_EVENTS.CREATE_ADMIN
            : ACTIVITY_TRACKER_EVENTS.CREATE_MID_ADMIN;

        logActivityTrackerEvent(req, eventType, {
          description: `Bulk: ${adminType} (${newAdmin.adminId}) created by ${creator.adminId} during bulk upload`,
          adminActions: {
            targetUserId: newAdmin.adminId,
            targetUserDetails: { email: newAdmin.email, fullPhoneNumber: newAdmin.fullPhoneNumber },
            reason: "Bulk Upload",
          },
        });

      } catch (rowError) {
        errorCount++;
        logWithTime(`❌ Error processing row for ${row.email}: ${rowError.message}`);
        reportRows.push({
          email: row.email,
          fullPhoneNumber: row.fullPhoneNumber,
          finalStatus: "Error",
          reason: `Internal Error: ${rowError.message}`
        });
      }
    } // End Loop

    // 🆕 9. Handle Aborted Rows (Logic for remaining items)
    // Agar reportRows kam hain total rows se, iska matlab loop beech mein break hua hai
    if (reportRows.length < rows.length) {
        const processedCount = reportRows.length;
        const remainingRows = rows.slice(processedCount);

        logWithTime(`⚠️ Marking ${remainingRows.length} rows as Aborted due to capacity limit.`);

        for (const skippedRow of remainingRows) {
            abortedCount++;
            reportRows.push({
                email: skippedRow.email || "-",
                fullPhoneNumber: skippedRow.fullPhoneNumber || "-",
                adminType: skippedRow.adminType || "-",
                initialStatus: skippedRow.status || "Pending",
                finalStatus: "Aborted", // User ko dikhega "Aborted"
                reason: "Process stopped: Server Capacity Full"
            });
        }
    }

    // 📁 Generate Excel Report
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(reportRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "BulkCreationReport");

    const tempDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `bulk_admin_report_${Date.now()}.xlsx`;
    const filePath = path.join(tempDir, fileName);

    XLSX.writeFile(workbook, filePath);

    logWithTime(`📄 Bulk report generated: ${fileName}`);

    // ✅ Final Response
    return res.status(CREATED).json({
      message: "Bulk admin creation process completed",
      summary: {
        totalProcessed: rows.length,
        created: createdCount,
        invalid: invalidCount,
        skipped: notApplicableCount,
        errors: errorCount,
        aborted: abortedCount, // 🆕 Summary mein bhi dikhega
        reportFile: fileName
      },
      downloadUrl: `/api/v1/downloads/${fileName}`
    });

  } catch (err) {
    logWithTime(`❌ Critical Error in bulk admin creation ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { bulkAdminCreate };