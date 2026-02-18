/**
 * 🧪 Quick SMS Test - Single Message
 * Tests SMS sending with current configuration
 * 
 * Modes:
 * - mock: Console preview only
 * - termux-ssh: Send via SSH to Termux (laptop → mobile)
 * - real: Direct Termux (run in Termux on mobile)
 * 
 * Usage:
 * 1. Laptop (mock): node src/testing/quick-sms-test.js
 * 2. Laptop (SSH): SMS_MODE=termux-ssh node src/testing/quick-sms-test.js
 * 3. Termux: SMS_MODE=real node src/testing/quick-sms-test.js
 */

require('dotenv').config();
require('module-alias/register');

const { sendSMS } = require('@/services/common/sms.service');

const phoneNumber = process.env.TEST_PHONE_NUMBER || "+919456974451";
const message = "🎉 Test SMS from Admin Panel Service! System is working perfectly.";

console.log("\n🧪 Quick SMS Test");
console.log("━".repeat(60));
console.log(`📞 To: ${phoneNumber}`);
console.log(`💬 Message: ${message}`);
console.log(`🔧 Mode: ${process.env.SMS_MODE || 'mock'}`);
console.log("━".repeat(60) + "\n");

(async () => {
  try {
    const result = await sendSMS(phoneNumber, { message });
    
    if (result.success) {
      if (result.mock) {
        console.log("\n💡 Mock mode - No actual SMS sent");
        console.log("📱 To send real SMS:");
        console.log("   1. Setup Termux SSH (see TERMUX_SETUP.md)");
        console.log("   2. Set SMS_MODE=termux-ssh in .env");
        console.log("   3. Run this script again\n");
      } else {
        console.log("\n✅ Real SMS sent successfully!");
        console.log(`📱 Check phone: ${phoneNumber}\n`);
      }
    } else {
      console.log("\n⚠️ SMS failed:", result.error || result.reason);
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
})();
