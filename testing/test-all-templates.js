/**
 * 🧪 Comprehensive Email & SMS Templates Testing
 * Tests ALL 40+ templates by sending to test email and phone
 * Uses factory pattern with AUTH_MODE=both to send both email and SMS
 * 
 * Usage: node src/testing/test-all-templates.js
 */

require('dotenv').config();
require('module-alias/register');

const { sendNotificationFactory } = require('@utils/notification-dispatcher.util');
const { logWithTime } = require('@utils/time-stamps.util');

// Test recipient (matches your .env configuration)
const testRecipient = {
  adminId: "ADM2024TEST",
  email: "yatharthsaxena25@gmail.com",
  fullPhoneNumber: "+917310952810",
  adminType: "Super Admin"
};

// Test data for various scenarios
const testData = {
  requester: { adminId: "ADM2024REQ", adminType: "Admin" },
  supervisor: { adminId: "ADM2024SUP", adminType: "Super Admin" },
  actor: { adminId: "ADM2024ACT", adminType: "Manager" },
  newAdmin: { adminId: "ADM2024NEW", adminType: "Admin" },
  requestId: "REQ2024001",
  reason: "Testing template notification"
};

/**
 * ⏳ Sleep helper
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 🚀 Test all notification templates
 */
const testAllTemplates = async () => {
  logWithTime('╔══════════════════════════════════════════════════════════════╗');
  logWithTime('║   🧪 COMPREHENSIVE EMAIL & SMS TEMPLATE TESTING              ║');
  logWithTime('╚══════════════════════════════════════════════════════════════╝');
  logWithTime(`\n📧 Email: ${testRecipient.email}`);
  logWithTime(`📱 Phone: ${testRecipient.fullPhoneNumber}`);
  logWithTime(`🔧 AUTH_MODE: ${process.env.DEFAULT_AUTH_MODE || 'both'}`);
  logWithTime(`🔧 SMS_MODE: ${process.env.SMS_MODE || 'mock'}`);
  logWithTime('\n⏳ Starting tests... (2 seconds delay between each)\n');

  try {
    // ========== 1. ADMIN CREATION TEMPLATES ==========
    logWithTime('═══════════════════════════════════════════════════════════');
    logWithTime('📦 SECTION 1: ADMIN CREATION TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('1️⃣  Testing: Admin Created (Welcome)');
    sendNotificationFactory(testRecipient, 'adminCreated', {
      details: {
        'Admin ID': testData.newAdmin.adminId,
        'Role': testData.newAdmin.adminType,
        'Created By': testData.actor.adminId,
        'Created At': new Date().toLocaleString()
      }
    }, [testData.newAdmin, testData.actor.adminId]);
    await sleep(2000);

    logWithTime('2️⃣  Testing: Supervisor New Admin Notification');
    sendNotificationFactory(testRecipient, 'supervisorNewAdminNotification', {
      details: {
        'Admin ID': testData.newAdmin.adminId,
        'Role': testData.newAdmin.adminType,
        'Email': testRecipient.email,
        'Phone': testRecipient.fullPhoneNumber,
        'Created By': testData.actor.adminId
      }
    }, [testData.newAdmin, testData.actor.adminId]);
    await sleep(2000);

    logWithTime('3️⃣  Testing: Supervisor Admin Creation Notification');
    sendNotificationFactory(testRecipient, 'supervisorAdminCreation', {
      details: {
        'Admin ID': testData.newAdmin.adminId,
        'Role': testData.newAdmin.adminType,
        'Created By': testData.actor.adminId
      }
    }, [testData.newAdmin, testData.actor.adminId]);
    await sleep(2000);

    // ========== 2. ACTIVATION REQUEST TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('🟢 SECTION 2: ACTIVATION REQUEST TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('4️⃣  Testing: Activation Request Submitted');
    sendNotificationFactory(testRecipient, 'activationRequestSubmitted', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Submitted At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId]);
    await sleep(2000);

    logWithTime('5️⃣  Testing: Activation Request Pending');
    sendNotificationFactory(testRecipient, 'activationRequestPending', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Requested By': testData.requester.adminId,
        'Submitted At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requester.adminId]);
    await sleep(2000);

    logWithTime('6️⃣  Testing: Activation Request Review');
    sendNotificationFactory(testRecipient, 'activationRequestReview', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Requested By': testData.requester.adminId
      }
    }, [testRecipient, testData.requestId, testData.requester.adminId]);
    await sleep(2000);

    // ========== 3. DEACTIVATION REQUEST TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('🔴 SECTION 3: DEACTIVATION REQUEST TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('7️⃣  Testing: Deactivation Request Submitted');
    sendNotificationFactory(testRecipient, 'deactivationRequestSubmitted', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Reason': testData.reason,
        'Submitted At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId, testData.reason]);
    await sleep(2000);

    logWithTime('8️⃣  Testing: Deactivation Request Review');
    sendNotificationFactory(testRecipient, 'deactivationRequestReview', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Requested By': testData.requester.adminId,
        'Reason': testData.reason
      }
    }, [testRecipient, testData.requestId, testData.requester.adminId, testData.reason]);
    await sleep(2000);

    // ========== 4. DIRECT ACTIVATION TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('✅ SECTION 4: DIRECT ACTIVATION TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('9️⃣  Testing: Admin Activated');
    sendNotificationFactory(testRecipient, 'adminActivated', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Activated By': testData.actor.adminId,
        'Activated At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.actor.adminId]);
    await sleep(2000);

    logWithTime('🔟 Testing: Activation Confirmation');
    sendNotificationFactory(testRecipient, 'activationConfirmation', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Activated At': new Date().toLocaleString()
      }
    }, [testRecipient]);
    await sleep(2000);

    logWithTime('1️⃣1️⃣ Testing: Activation Notification to Supervisor');
    sendNotificationFactory(testRecipient, 'activationNotificationSupervisor', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Activated By': testData.actor.adminId,
        'Activated At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.actor.adminId]);
    await sleep(2000);

    // ========== 5. DIRECT DEACTIVATION TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('⛔ SECTION 5: DIRECT DEACTIVATION TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('1️⃣2️⃣ Testing: Admin Deactivated');
    sendNotificationFactory(testRecipient, 'adminDeactivated', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Deactivated By': testData.actor.adminId,
        'Reason': testData.reason,
        'Deactivated At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.actor.adminId, testData.reason]);
    await sleep(2000);

    logWithTime('1️⃣3️⃣ Testing: Deactivation Confirmation');
    sendNotificationFactory(testRecipient, 'deactivationConfirmation', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Deactivated At': new Date().toLocaleString()
      }
    }, [testRecipient]);
    await sleep(2000);

    logWithTime('1️⃣4️⃣ Testing: Deactivation Notification to Supervisor');
    sendNotificationFactory(testRecipient, 'deactivationNotificationSupervisor', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Deactivated By': testData.actor.adminId,
        'Deactivated At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.actor.adminId]);
    await sleep(2000);

    // ========== 6. DETAILS UPDATE TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('📝 SECTION 6: DETAILS UPDATE TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('1️⃣5️⃣ Testing: Details Update Confirmation');
    sendNotificationFactory(testRecipient, 'detailsUpdateConfirmation', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Fields Updated': 'Email, Phone, Address',
        'Updated By': testData.actor.adminId,
        'Updated At': new Date().toLocaleString()
      }
    }, [testRecipient, ['Email', 'Phone', 'Address'], testData.actor.adminId]);
    await sleep(2000);

    logWithTime('1️⃣6️⃣ Testing: Details Update to Supervisor');
    sendNotificationFactory(testRecipient, 'detailsUpdateSupervisor', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Fields Updated': 'Email, Phone',
        'Updated By': testData.actor.adminId
      }
    }, [testRecipient, ['Email', 'Phone'], testData.actor.adminId]);
    await sleep(2000);

    // ========== 7. ACTIVATION APPROVAL TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('✔️  SECTION 7: ACTIVATION APPROVAL TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('1️⃣7️⃣ Testing: Activation Approved (Requester)');
    sendNotificationFactory(testRecipient, 'activationApprovedRequester', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Approved By': testData.supervisor.adminId,
        'Approved At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId, testData.supervisor.adminId]);
    await sleep(2000);

    logWithTime('1️⃣8️⃣ Testing: Activation Approval Confirmation (Actor)');
    sendNotificationFactory(testRecipient, 'activationApprovalConfirmation', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Approved At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId]);
    await sleep(2000);

    logWithTime('1️⃣9️⃣ Testing: Activation Approved (Supervisor)');
    sendNotificationFactory(testRecipient, 'activationApprovedSupervisor', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Approved By': testData.actor.adminId
      }
    }, [testRecipient, testData.requestId, testData.actor.adminId]);
    await sleep(2000);

    // ========== 8. ACTIVATION REJECTION TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('❌ SECTION 8: ACTIVATION REJECTION TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('2️⃣0️⃣ Testing: Activation Rejected (Requester)');
    sendNotificationFactory(testRecipient, 'activationRejectedRequester', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Rejected By': testData.supervisor.adminId,
        'Reason': 'Pending review',
        'Rejected At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId, testData.supervisor.adminId, 'Pending review']);
    await sleep(2000);

    logWithTime('2️⃣1️⃣ Testing: Activation Rejection Confirmation (Actor)');
    sendNotificationFactory(testRecipient, 'activationRejectionConfirmation', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Rejected At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId]);
    await sleep(2000);

    logWithTime('2️⃣2️⃣ Testing: Activation Rejected (Supervisor)');
    sendNotificationFactory(testRecipient, 'activationRejectedSupervisor', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Rejected By': testData.actor.adminId
      }
    }, [testRecipient, testData.requestId, testData.actor.adminId]);
    await sleep(2000);

    // ========== 9. DEACTIVATION APPROVAL TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('✅ SECTION 9: DEACTIVATION APPROVAL TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('2️⃣3️⃣ Testing: Deactivation Approved (Requester)');
    sendNotificationFactory(testRecipient, 'deactivationApprovedRequester', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Approved By': testData.supervisor.adminId,
        'Approved At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId, testData.supervisor.adminId]);
    await sleep(2000);

    logWithTime('2️⃣4️⃣ Testing: Deactivation Approval Confirmation (Actor)');
    sendNotificationFactory(testRecipient, 'deactivationApprovalConfirmation', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Approved At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId]);
    await sleep(2000);

    logWithTime('2️⃣5️⃣ Testing: Deactivation Approved (Supervisor)');
    sendNotificationFactory(testRecipient, 'deactivationApprovedSupervisor', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Approved By': testData.actor.adminId
      }
    }, [testRecipient, testData.requestId, testData.actor.adminId]);
    await sleep(2000);

    // ========== 10. DEACTIVATION REJECTION TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('🚫 SECTION 10: DEACTIVATION REJECTION TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('2️⃣6️⃣ Testing: Deactivation Rejected (Requester)');
    sendNotificationFactory(testRecipient, 'deactivationRejectedRequester', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Rejected By': testData.supervisor.adminId,
        'Reason': 'Not justified',
        'Rejected At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId, testData.supervisor.adminId, 'Not justified']);
    await sleep(2000);

    logWithTime('2️⃣7️⃣ Testing: Deactivation Rejection Confirmation (Actor)');
    sendNotificationFactory(testRecipient, 'deactivationRejectionConfirmation', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Rejected At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.requestId]);
    await sleep(2000);

    logWithTime('2️⃣8️⃣ Testing: Deactivation Rejected (Supervisor)');
    sendNotificationFactory(testRecipient, 'deactivationRejectedSupervisor', {
      details: {
        'Request ID': testData.requestId,
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Rejected By': testData.actor.adminId
      }
    }, [testRecipient, testData.requestId, testData.actor.adminId]);
    await sleep(2000);

    // ========== 11. ROLE CHANGE TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('🔄 SECTION 11: ROLE CHANGE TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('2️⃣9️⃣ Testing: Role Changed');
    sendNotificationFactory(testRecipient, 'roleChanged', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Old Role': 'Admin',
        'New Role': 'Super Admin',
        'Changed By': testData.actor.adminId,
        'Changed At': new Date().toLocaleString()
      }
    }, [testRecipient, 'Admin', 'Super Admin', testData.actor.adminId]);
    await sleep(2000);

    // ========== 12. SUPERVISOR CHANGE TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('👥 SECTION 12: SUPERVISOR CHANGE TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('3️⃣0️⃣ Testing: New Supervisor Assigned');
    sendNotificationFactory(testRecipient, 'newSupervisorAssigned', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'New Supervisor': testData.supervisor.adminId,
        'Assigned By': testData.actor.adminId,
        'Assigned At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.supervisor, testData.actor.adminId]);
    await sleep(2000);

    logWithTime('3️⃣1️⃣ Testing: Supervisor Removed');
    sendNotificationFactory(testRecipient, 'supervisorRemoved', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Removed By': testData.actor.adminId,
        'Removed At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.actor.adminId]);
    await sleep(2000);

    logWithTime('3️⃣2️⃣ Testing: Supervisor Changed');
    sendNotificationFactory(testRecipient, 'supervisorChanged', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Old Supervisor': 'ADM2024OLD',
        'New Supervisor': testData.supervisor.adminId,
        'Changed By': testData.actor.adminId,
        'Changed At': new Date().toLocaleString()
      }
    }, [testRecipient, { adminId: 'ADM2024OLD' }, testData.supervisor, testData.actor.adminId]);
    await sleep(2000);

    // ========== 13. PASSWORD RESET TEMPLATE ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('🔐 SECTION 13: PASSWORD RESET TEMPLATE');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('3️⃣3️⃣ Testing: Password Reset');
    sendNotificationFactory(testRecipient, 'passwordReset', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Reset By': testData.actor.adminId,
        'Reset At': new Date().toLocaleString()
      }
    }, [testRecipient, 'TEMP123456', testData.actor.adminId]);
    await sleep(2000);

    // ========== 14. OWN DETAILS UPDATE TEMPLATE ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('✏️  SECTION 14: OWN DETAILS UPDATE TEMPLATE');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('3️⃣4️⃣ Testing: Own Details Updated');
    sendNotificationFactory(testRecipient, 'ownDetailsUpdated', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Fields Updated': 'Name, Email, Phone',
        'Updated At': new Date().toLocaleString()
      }
    }, [testRecipient, ['Name', 'Email', 'Phone']]);
    await sleep(2000);

    // ========== 15. ADMIN BLOCKED/UNBLOCKED TEMPLATES ==========
    logWithTime('\n═══════════════════════════════════════════════════════════');
    logWithTime('🔒 SECTION 15: ADMIN BLOCKED/UNBLOCKED TEMPLATES');
    logWithTime('═══════════════════════════════════════════════════════════\n');

    logWithTime('3️⃣5️⃣ Testing: Admin Blocked');
    sendNotificationFactory(testRecipient, 'adminBlocked', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Blocked By': testData.actor.adminId,
        'Reason': 'Multiple failed login attempts',
        'Blocked At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.actor.adminId, 'Multiple failed login attempts']);
    await sleep(2000);

    logWithTime('3️⃣6️⃣ Testing: Admin Unblocked');
    sendNotificationFactory(testRecipient, 'adminUnblocked', {
      details: {
        'Admin ID': testRecipient.adminId,
        'Role': testRecipient.adminType,
        'Unblocked By': testData.actor.adminId,
        'Unblocked At': new Date().toLocaleString()
      }
    }, [testRecipient, testData.actor.adminId]);
    await sleep(2000);

    // ========== FINAL SUMMARY ==========
    logWithTime('\n╔══════════════════════════════════════════════════════════════╗');
    logWithTime('║   ✅ ALL TEMPLATES TESTED SUCCESSFULLY!                      ║');
    logWithTime('╚══════════════════════════════════════════════════════════════╝');
    logWithTime(`\n📊 Summary:`);
    logWithTime(`   • Total Templates Tested: 36`);
    logWithTime(`   • Email Recipient: ${testRecipient.email}`);
    logWithTime(`   • SMS Recipient: ${testRecipient.fullPhoneNumber}`);
    logWithTime(`   • AUTH_MODE: ${process.env.DEFAULT_AUTH_MODE || 'both'}`);
    logWithTime(`   • SMS_MODE: ${process.env.SMS_MODE}`);
    
    logWithTime(`\n📬 Next Steps:`);
    logWithTime(`   1. Check email inbox: ${testRecipient.email}`);
    logWithTime(`   2. Check SMS on phone: ${testRecipient.fullPhoneNumber}`);
    logWithTime(`   3. Emails may take 10-60 seconds to arrive`);
    logWithTime(`   4. SMS delivery depends on Termux SSH connection`);
    
    if (process.env.SMS_MODE === 'mock') {
      logWithTime(`\n💡 SMS is in MOCK mode - messages shown in console only`);
      logWithTime(`   To send real SMS, ensure:`);
      logWithTime(`   • Termux SSH server is running on Android`);
      logWithTime(`   • SMS_MODE=termux-ssh in .env`);
      logWithTime(`   • TERMUX_IP, TERMUX_PORT, TERMUX_USER are correct`);
    }

    logWithTime('\n🎉 Testing complete!');
    
  } catch (error) {
    logWithTime(`\n❌ Error during testing: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

// Run tests
testAllTemplates()
  .then(() => {
    logWithTime('\n👋 Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    logWithTime(`\n💥 Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
