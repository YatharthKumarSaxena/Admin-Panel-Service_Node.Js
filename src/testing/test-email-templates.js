/**
 * 🧪 Email Templates Testing
 * Test all email templates by sending to test email
 * 
 * Usage: node src/testing/test-email-templates.js
 */

require('dotenv').config();
require('module-alias/register');
const {
  sendWelcomeEmail,
  sendActivationEmail,
  sendDeactivationEmail,
  sendRoleChangeEmail,
  sendDetailsUpdatedEmail,
  sendAccountBlockedEmail,
  sendAccountUnblockedEmail,
  sendRoleChangeRequestEmail,
} = require('@utils/email-notification.util');
const { logWithTime } = require('@utils/time-stamps.util');

const TEST_EMAIL = 'yatharthsaxena25@gmail.com';

/**
 * 🚀 Test all email templates
 */
const testAllTemplates = async () => {
  logWithTime('🧪 Starting Email Template Tests...');
  logWithTime(`📧 Sending all test emails to: ${TEST_EMAIL}`);
  logWithTime('⏳ Please wait, sending emails...\n');

  try {
    // Test 1: Welcome Email (Admin Created)
    logWithTime('1️⃣ Testing Welcome Email (Admin Created)...');
    sendWelcomeEmail(
      TEST_EMAIL,
      'ADM-12345',
      'Super Admin',
      'System Administrator'
    );

    // Wait 2 seconds between emails to avoid rate limiting
    await sleep(2000);

    // Test 2: Activation Email
    logWithTime('2️⃣ Testing Account Activation Email...');
    sendActivationEmail(
      TEST_EMAIL,
      'ADM-12345',
      'Super Admin',
      'System Administrator'
    );

    await sleep(2000);

    // Test 3: Deactivation Email
    logWithTime('3️⃣ Testing Account Deactivation Email...');
    sendDeactivationEmail(
      TEST_EMAIL,
      'ADM-12345',
      'Super Admin',
      'System Administrator',
      'Security policy violation'
    );

    await sleep(2000);

    // Test 4: Role Change Email
    logWithTime('4️⃣ Testing Role Change Email...');
    sendRoleChangeEmail(
      TEST_EMAIL,
      'ADM-12345',
      'Admin',
      'Super Admin',
      'System Administrator'
    );

    await sleep(2000);

    // Test 5: Details Updated Email
    logWithTime('5️⃣ Testing Details Updated Email...');
    sendDetailsUpdatedEmail(
      TEST_EMAIL,
      'ADM-12345',
      'Super Admin',
      ['Name', 'Phone Number', 'Address'],
      'System Administrator'
    );

    await sleep(2000);

    // Test 6: Account Blocked Email
    logWithTime('6️⃣ Testing Account Blocked Email...');
    sendAccountBlockedEmail(
      TEST_EMAIL,
      'ADM-12345',
      'Super Admin',
      'System Administrator',
      'Multiple failed login attempts'
    );

    await sleep(2000);

    // Test 7: Account Unblocked Email
    logWithTime('7️⃣ Testing Account Unblocked Email...');
    sendAccountUnblockedEmail(
      TEST_EMAIL,
      'ADM-12345',
      'Super Admin',
      'System Administrator'
    );

    await sleep(2000);

    // Test 8: Role Change Request Email
    logWithTime('8️⃣ Testing Role Change Request Email...');
    sendRoleChangeRequestEmail(
      TEST_EMAIL,
      'REQ-98765',
      'ADM-12345',
      'Admin',
      'Super Admin',
      'System Administrator'
    );

    logWithTime('\n✅ All test emails have been queued for sending!');
    logWithTime(`📬 Check inbox: ${TEST_EMAIL}`);
    logWithTime('⏰ Emails may take 10-30 seconds to arrive');
    logWithTime('\n💡 Check these email variations:');
    logWithTime('   • Different status badges (Success, Pending, Rejected)');
    logWithTime('   • Action buttons and links');
    logWithTime('   • Responsive design (try mobile view)');
    logWithTime('   • Dark theme appearance');
    logWithTime('   • Details section formatting');

  } catch (error) {
    logWithTime(`❌ Error during testing: ${error.message}`);
    console.error(error);
  }
};

/**
 * ⏳ Sleep helper
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Run tests
testAllTemplates();
