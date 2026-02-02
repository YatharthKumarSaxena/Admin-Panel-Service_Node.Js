// 📁 configs/field-lengths.config.js

module.exports = {
  fullPhoneNumberLength: {
    min: 11,
    max: 16 
  },
  emailLength: {
    min: 5,
    max: 254
  },
  firstNameLength: {
    min: 2,
    max: 50
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
    min: 0,
    max: 500
  },
  adminIdLength: {
    min: 10, 
    max: 10
  }
  ,mongoIdLength: {
    min: 24,
    max: 24
  },
  uuidV4Length: {
    min: 36,
    max: 36
  }
};