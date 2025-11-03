// Checks if value exists in enum values
const isValidEnumValue = (enumObj, value) => {
  return Object.values(enumObj).includes(value); // ✅ Boolean
};

// Checks if value exists in enum and returns boolean
const getEnumKeyByValue = (enumObj, value) => {
  return Object.keys(enumObj).some(key => enumObj[key] === value); // ✅ Boolean
};

const validateLength = (str, min, max) => {
  return str.length >= min && str.length <= max;
};

const isValidRegex = (str, regex) => {
  return regex.test(str);
};

module.exports = {
  isValidEnumValue,
  getEnumKeyByValue,
  validateLength,
  isValidRegex
};