// Extracting the Required Modules
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const { logWithTime } = require("../utils/time-stamps.utils");
const { throwAccessDeniedError, errorMessage, throwInternalServerError, throwResourceNotFoundError, throwInvalidResourceError, getLogIdentifiers, logMiddlewareError } = require("../configs/error-handler.configs");
const { secretCodeOfAccessToken, secretCodeOfRefreshToken, expiryTimeOfAccessToken } = require("../configs/user-id.config");
const { makeTokenWithMongoID } = require("../utils/issue-token.utils");
const { extractAccessToken, extractRefreshToken } = require("../utils/extract-token.utils");
const { checkUserIsNotVerified } = require("../controllers/auth.controllers");
const { setAccessTokenHeaders } = require("../utils/token-headers.utils");
const {  FORBIDDEN } = require("../configs/http-status.config");

// Logic to Verify Token and Update jwtTokenIssuedAt time
const verifyToken = (req,res,next) => {
    const accessToken = extractAccessToken(req);
    if(!accessToken){
        logMiddlewareError("Verify Token , Access Token not found",req);
        return throwResourceNotFoundError(res,"Access Token");
    }
    // Now Verifying whether the provided JWT Token is valid token or not
    jwt.verify(accessToken,secretCodeOfAccessToken,async (err,decoded)=>{
        try{
            let user = req.user;
            if (err || !decoded || !decoded.id) { // Means Access Token Provided is found invalid  
                if (!user) {
                    // Try extracting from refreshToken again (defensive fallback)
                    const refreshToken = extractRefreshToken(req);
                    const decodedRefresh = jwt.verify(refreshToken, secretCodeOfRefreshToken);
                    user = await UserModel.findById(decodedRefresh.id);
                    req.user = user;
                }         
                const isRefreshTokenInvalid = await checkUserIsNotVerified(req,res);
                if(isRefreshTokenInvalid){
                    //  Validate Token Payload Strictly
                    logWithTime(`⚠️ Access Denied, User with userID: (${user.userID}) is logged out`);
                    return res.status(FORBIDDEN).send({
                        success: false,
                        message: "Access Denied to perform action",
                        reason: "You are not logged in, please login to continue"
                    });
                }
                if(res.headersSent)return;
                // Logic to generate new access token
                const newAccessToken = await makeTokenWithMongoID(req,res,expiryTimeOfAccessToken);
                // Set this token in Response Headers
                const isAccessTokenSet = setAccessTokenHeaders(res,newAccessToken);
                if(!isAccessTokenSet){
                    logWithTime(`❌ Access token set in header failed for User (${user.userID}) at the time of token verification. Request is made from device id: (${req.deviceID})`);
                    return throwInternalServerError(res);
                }
                if(!res.headersSent)return next();
            }
            logWithTime(`✅ Token Validated and User Fetched for device ID: ${req.deviceID}`);
            // Very next line should be:
            if (!res.headersSent) return next();
        }catch(err){
            const getIdentifiers = getLogIdentifiers(req);
            logWithTime(`❌ An Internal Error Occurred while verifying access token ${getIdentifiers}`);
            errorMessage(err);
            return throwInternalServerError(res);
        }
    })
}


const verifyTokenOwnership = async(req, res, next) => {
    try {
        // 1. Extract refresh token from cookies (assuming 'token' key stores the refresh token)
        const refreshToken = extractRefreshToken(req);
        if (!refreshToken) { // if refreshToken Not Found
            logMiddlewareError(`Verify Token Ownnership,Refresh Token Missing in Cookies`, req);
            return throwResourceNotFoundError(res, "Refresh token");
        }
        // 2. Verify refresh token
        let decodedRefresh;
        try{
            decodedRefresh = jwt.verify(refreshToken, secretCodeOfRefreshToken);
        }catch(err){
            logWithTime(`⚠️ Decoded Refresh Token lacks user ID. Device: (${req.deviceID})`);
            return throwInvalidResourceError(res, "Refresh token");
        }
        // 3. Check Whether Refresh Token Provided is Valid or Not
        const tokenExists = await UserModel.findOne({ refreshToken: refreshToken }); // or Redis GET
        if (!tokenExists) {
            logWithTime(`⚠️ Stale Refresh Token detected. User: (${decodedRefresh.id}) | Device: (${req.deviceID})`);
            return throwAccessDeniedError(res, "Stale Refresh Token");
        }
        // 4. Extract Access token
        const accessToken = extractAccessToken(req);
        if(!accessToken){
            req.user = tokenExists;
            logMiddlewareError(`Verify Token Ownership, Access Token Field Missing`, req);
            return throwResourceNotFoundError(res, "Access token");
        }
        let decodedAccess;
        try {
            decodedAccess = jwt.verify(accessToken, secretCodeOfAccessToken);
        } catch (err) {
        if (err.name === "TokenExpiredError") {
            logWithTime("⚠️ Access token is expired, passing control to next middleware");
            if (!res.headersSent) return next(); // ✅ Let next middleware handle it
        }
        logWithTime("❌ Access token is invalid");
        return throwInvalidResourceError(res, "Access Token");
        }
        // 5. Match both token owners
        if (decodedAccess && String(decodedAccess.id) !== String(decodedRefresh.id)) {
            logWithTime("Token mismatch: Access and Refresh tokens belong to different users");
            return throwAccessDeniedError(res,"Access and Refresh tokens belong to different users");
        }
        // 🔍  Find user from DB
        const user = await UserModel.findById(decodedRefresh.id);
        if (!user) {
            logMiddlewareError(`Verify Access Token, Unauthorized User Provided from Refresh Token`, req);
            return throwResourceNotFoundError(res, "User");
        }
        // ✅ Tokens are valid and synced – attach user to req
        req.user = user;
        // ✅ All checks passed
        if(!res.headersSent)next();
        } catch (err) {
        const getIdentifiers = getLogIdentifiers(req);
        logWithTime(`❌ An Internal Error Occurred while verifying token ownership ${getIdentifiers}`);
        errorMessage(err)
        return throwInternalServerError(res);
    }
};

module.exports = {
    verifyToken: verifyToken,
    verifyTokenOwnership: verifyTokenOwnership
}