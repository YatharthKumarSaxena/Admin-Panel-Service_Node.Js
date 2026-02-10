const { getMyEnv } = require("@/utils/get-my-env.util");

module.exports = {
  SALT: Number(getMyEnv('SALT', '10')),
  authMode: getMyEnv('AUTH_MODE', 'both'),
  auditMode: getMyEnv('AUDIT_MODE', 'CHANGED_ONLY'),
  verificationMode: getMyEnv('VERIFICATION_MODE', 'optional'),
  ACTIVITY_TRACKING_ENABLED: getMyEnv('ACTIVITY_TRACKING_ENABLED', 'true') === 'true',
  otp: {
    length: 6,                // digits in OTP
    maxAttempts: 5,
    digits: "0123456789"      // OTP characters allowed
  },
  hashing: {
    algorithm: "sha256",
    encoding: "hex",
    saltLength: 16
  },
  passwordSecurity: {
    MAX_ATTEMPTS: 5,           // 5 baar galat password allow hai
    LOCKOUT_TIME_MINUTES: 15   // Uske baad 15 minute ka ban
  },
  WHITELISTED_DEVICE_UUIDS: getMyEnv('WHITELISTED_DEVICE_UUIDS', '').split(',').filter(Boolean),
  FIRST_NAME_SETTING: getMyEnv('FIRST_NAME_SETTING', 'required'),
  link: {
    length: 32,
    algorithm: "sha256",
    encoding: "hex",
    secret: getMyEnv('VERIFICATION_LINK_SECRET', 'default-secret-change-in-production')
  }
};