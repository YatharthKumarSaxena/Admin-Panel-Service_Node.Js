/**
 * 🧪 SMS Templates Testing
 * Test all SMS templates by sending to test phone number
 * 
 * Usage: node src/testing/test-sms-templates.js
 */

require('dotenv').config();
require('module-alias/register');

const {
  sendAdminActivatedSMS,
  sendAdminDeactivatedSMS,
  sendDetailsUpdatedSMS
} = require('@utils/sms-notification.util');

const { logWithTime } = require('@utils/time-stamps.util');

// Test admin object (matching Admin model structure)
const testAdmin = {
  adminId: "ADM2024001",
  fullPhoneNumber: process.env.TEST_PHONE_NUMBER || "+919456974451",
  email: "admin@adminpanel.com",
  role: { name: "Super Admin" }
};

/**
 * 🚀 Test all SMS templates
 */
const testAllSMSTemplates = async () => {
  logWithTime('🧪 Starting SMS Template Tests...');
  logWithTime(`📱 Target phone: ${testAdmin.fullPhoneNumber}`);
  logWithTime(`🔧 SMS Mode: ${process.env.SMS_MODE || 'mock'}`);
  logWithTime('⏳ Please wait, sending SMS...\n');

  try {
    // Test 1: Admin Created SMS
    logWithTime('1️⃣ Testing: Admin Created SMS');
    await sendAdminCreatedSMS(testAdmin, "System Administrator");
    await sleep(2000);

    // Test 2: Admin Activated SMS
    logWithTime('\n2️⃣ Testing: Admin Activated SMS');
    await sendAdminActivatedSMS(testAdmin, "HR Department");
    await sleep(2000);

    // Test 3: Admin Deactivated SMS
    logWithTime('\n3️⃣ Testing: Admin Deactivated SMS');
    await sendAdminDeactivatedSMS(testAdmin, "Security Team", "Temporary suspension for policy review");
    await sleep(2000);

    // Test 4: Role Changed SMS
    logWithTime('\n4️⃣ Testing: Role Changed SMS');
    await sendRoleChangedSMS(testAdmin, "Manager", "Super Admin", "CEO");
    await sleep(2000);

    // Test 5: Details Updated SMS
    logWithTime('\n5️⃣ Testing: Details Updated SMS');
    await sendDetailsUpdatedSMS(testAdmin, ["Email", "Phone", "Address"], "Self Update");
    await sleep(2000);

    // Test 6: Admin Blocked SMS
    logWithTime('\n6️⃣ Testing: Admin Blocked SMS');
    await sendAdminBlockedSMS(testAdmin, "Security Team", "Multiple failed login attempts");
    await sleep(2000);

    // Test 7: Admin Unblocked SMS
    logWithTime('\n7️⃣ Testing: Admin Unblocked SMS');
    await sendAdminUnblockedSMS(testAdmin, "Security Team");
    await sleep(2000);

    // Test 8: Role Change Requested SMS
    logWithTime('\n8️⃣ Testing: Role Change Requested SMS');
    await sendRoleChangeRequestedSMS(testAdmin, "Manager", "Senior Manager");
    await sleep(2000);

    // Test 9: Role Change Approved SMS
    logWithTime('\n9️⃣ Testing: Role Change Approved SMS');
    await sendRoleChangeApprovedSMS(testAdmin, "Manager", "Senior Manager", "Director");
    await sleep(2000);

    // Test 10: Role Change Rejected SMS
    logWithTime('\n🔟 Testing: Role Change Rejected SMS');
    await sendRoleChangeRejectedSMS(testAdmin, "Senior Manager", "Director", "Insufficient experience");

    logWithTime('\n✅ All SMS templates tested successfully!');
    
    if (process.env.SMS_MODE === 'mock') {
      logWithTime('\n💡 Running in MOCK mode - SMS shown in console only');
      logWithTime('📱 To send real SMS:');
      logWithTime('   1. Set SMS_MODE=real in .env');
      logWithTime('   2. Run this script in Termux on Android');
    } else {
      logWithTime(`\n📬 Check phone: ${testAdmin.fullPhoneNumber}`);
      logWithTime('⏰ SMS may take 10-30 seconds to arrive');
    }

  } catch (error) {
    logWithTime(`❌ Test failed: ${error.message}`);
    console.error(error);
  }
};

/**
 * ⏳ Sleep helper
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Run tests
testAllSMSTemplates();
