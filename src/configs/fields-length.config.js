// 📁 configs/field-lengths.config.js

module.exports = {
  fullPhoneNumberLength: {
    min: 11,
    max: 16 // E.164 max with '+' sign
  },
  emailLength: {
    min: 5,
    max: 254
  },
  deviceNameLength: {
    min: 3,
    max: 64
  },
  reasonFieldLength: {
    min: 10,
    max: 500
  },
  notesFieldLength: {
    max: 500
  },
  customIdLength: {
    min: 10, 
    max: 10
  }
  ,mongoIdLength: {
    min: 24,
    max: 24
  }
};