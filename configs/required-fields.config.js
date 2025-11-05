const getAuthFields = () => {
  const mode = process.env.DEFAULT_AUTH_MODE;

  // 🔹 Step 1: Determine login identifiers
  let identifierFields = [];
  if (mode === AuthModes.EMAIL) {
    identifierFields = ["emailId"];
  } else if (mode === AuthModes.PHONE) {
    identifierFields = ["fullPhoneNumber"];
  } else if (mode === AuthModes.BOTH) {
    identifierFields = ["emailId", "fullPhoneNumber"];
  } else {
    // Safe fallback (if env misconfigured)
    identifierFields = ["emailId", "fullPhoneNumber"];
  }
  return identifierFields;
};

const adminCreationRequiredFields = [
  ...getAuthFields(),
  "adminType"
];

const adminCreationInBulkRequiredFields = [
  ...getAuthFields(),
  "adminType"
];

module.exports = {
 adminCreationRequiredFields,
 adminCreationInBulkRequiredFields
};
