const { throwAccessDeniedError } = require("../configs/error-handler.configs");
const { logWithTime } = require("../utils/time-stamps.utils");

const validateObjectShape = (token, requiredFields, label, res) => {
  const keys = Object.keys(token);
  const missing = requiredFields.filter(f => !keys.includes(f));
  const extra = keys.filter(f => !requiredFields.includes(f));

  if (missing.length || extra.length) {
    logWithTime(`❌ [validatePayloadShape] ${label} token malformed`);
    logWithTime(`Missing: ${missing.join(", ") || "None"} | Extra: ${extra.join(", ") || "None"}`);
    throwAccessDeniedError(res, `${label} token payload malformed`);
    return false;
  }

  logWithTime(`✅ [validatePayloadShape] ${label} token shape valid`);
  return true;
};

module.exports = { validateObjectShape };
