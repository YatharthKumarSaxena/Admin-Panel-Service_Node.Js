const { AuthModes } = require("@configs/enums.config");
const { 
  throwBadRequestError, 
  throwDBResourceNotFoundError, 
  throwInternalServerError 
} = require("@utils/error-handler.util");

/**
 * 🏭 Factory middleware to fetch any entity based on provided fetch function
 * @param {Function} fetchFunction - Entity fetch karne wala function (e.g., fetchAdmin, fetchUser)
 * @param {string} entityName - Entity ka naam for req attachment (e.g., "Admin", "User")
 * @returns {Function} Middleware function
 * 
 * Features:
 * - Strict validation: Wrong data = Immediate rejection
 * - AuthMode ke according validation karta hai
 * - EITHER mode mein single check (dono allowed nahi)
 * - No silent modifications - client ko clear error milega
 * - Scalable: Koi bhi entity type ke liye kaam karega
 */
const fetchEntityFactory = (fetchFunction, entityName) => {
  return async (req, res, next) => {
    try {
      const { email, fullPhoneNumber } = req.body;
      const authMode = process.env.AUTH_MODE || AuthModes.BOTH;

      let finalEmail = null;
      let finalPhone = null;

      // 📧 EMAIL Mode: ONLY email allowed, phone REJECT
      if (authMode === AuthModes.EMAIL) {
        if (fullPhoneNumber) {
          return throwBadRequestError(
            res, 
            "Phone number not allowed in EMAIL auth mode",
            "Remove fullPhoneNumber from request. Only email is accepted."
          );
        }
        if (!email) {
          return throwBadRequestError(
            res, 
            "Email is required for EMAIL auth mode",
            "Please provide email address"
          );
        }
        finalEmail = email;
        // finalPhone remains null
      }

      // 📱 PHONE Mode: ONLY phone allowed, email REJECT
      else if (authMode === AuthModes.PHONE) {
        if (email) {
          return throwBadRequestError(
            res, 
            "Email not allowed in PHONE auth mode",
            "Remove email from request. Only fullPhoneNumber is accepted."
          );
        }
        if (!fullPhoneNumber) {
          return throwBadRequestError(
            res, 
            "Phone number is required for PHONE auth mode",
            "Please provide fullPhoneNumber"
          );
        }
        finalPhone = fullPhoneNumber;
        // finalEmail remains null
      }

      // 🔀 BOTH Mode: Dono chahiye exactly
      else if (authMode === AuthModes.BOTH) {
        if (!email || !fullPhoneNumber) {
          return throwBadRequestError(
            res, 
            "Both email and fullPhoneNumber are required for BOTH auth mode",
            "Please provide both identifiers"
          );
        }
        finalEmail = email;
        finalPhone = fullPhoneNumber;
      }

      // ⚡ EITHER Mode: Koi ek chahiye (dono nahi, koi ek bhi nahi)
      else if (authMode === AuthModes.EITHER) {
        if (email && fullPhoneNumber) {
          return throwBadRequestError(
            res,
            "Send only one identifier in EITHER auth mode",
            "Provide either email OR fullPhoneNumber, not both"
          );
        }
        if (!email && !fullPhoneNumber) {
          return throwBadRequestError(
            res, 
            "Missing identifier", 
            "Either email or fullPhoneNumber is required"
          );
        }
        // Preference email ko
        finalEmail = email || null;
        finalPhone = fullPhoneNumber || null;
      }

      // 🔍 Fetch entity using provided function
      // Ab sirf valid values pass hongi, undefined nahi
      const foundEntity = await fetchFunction(finalEmail, finalPhone);
      
      if (!foundEntity) {
        return throwDBResourceNotFoundError(res, entityName);
      }

      // 📎 Attach to request with dynamic property name
      // e.g., req.foundAdmin or req.foundUser
      req[`found${entityName}`] = foundEntity;

      next();
      
    } catch (error) {
      return throwInternalServerError(res, error);
    }
  };
};

module.exports = { fetchEntityFactory };