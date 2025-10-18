// 📁 configs/field-lengths.config.js

module.exports = {
  fullPhoneNumberLength: {
    min: 11,
    max: 16 // E.164 max with '+' sign
  },
  emailLength: {
    min: 5,
    max: 254
  }
};