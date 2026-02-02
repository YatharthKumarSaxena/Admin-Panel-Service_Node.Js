module.exports = {
  SALT: Number(process.env.SALT),
  authMode: process.env.AUTH_MODE,
  auditMode: process.env.AUDIT_MODE,
  verificationMode: process.env.VERIFICATION_MODE,
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
  WHITELISTED_DEVICE_UUIDS: process.env.WHITELISTED_DEVICE_UUIDS ? process.env.WHITELISTED_DEVICE_UUIDS.split(',') : [],
  FIRST_NAME_SETTING: process.env.FIRST_NAME_SETTING,
  link: {
    length: 32,
    algorithm: "sha256",
    encoding: "hex",
    secret: process.env.VERIFICATION_LINK_SECRET
  }
};