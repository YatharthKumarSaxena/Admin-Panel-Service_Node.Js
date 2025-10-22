const { createClient } = require("redis");
const jwt = require("jsonwebtoken");
const { extractAccessToken } = require("../utils/extract-token.utils");
const { logWithTime } = require("../utils/time-stamps.utils");
const {
    throwAccessDeniedError,
    throwSessionExpiredError,
    throwInternalServerError,
    throwInvalidResourceError
} = require("../../configs/error-handler.configs");

/**
 * If any Corruption detected in Redis Stream
 * We will call internal call to Security Service made in Go
 * This Service will change first version of Redis Stream and after some tempers count , security service will change UUID of that Particular Device make a New Device UUID
 * Make an API call to All Frontends that Update this Device UUID (If UUID is updated by Security Service) , otherwise just inform version update of Redis Stream to Auth Service that this is new version update this
 * Make a Separate call to Auth Service Backend that Update this Device UUID in your DB (If UUID is updated by Security Service)
 * If UUID not updated then only Auth Service need to update version of Redis Stream which is exploited
 * Also Auth Service will update all Redis Streams by deleting Redis key containing that old device uuid replace it with new one (If UUID is updated by Security Service) 
 * Internal data of Redis will be changed only to that Redis Stream in which Front end has identified for that particular UserID 
 * For that particular User Auth Service will do either forced log out from that specific device or log out from all devices
 * Or we can do token rotation only 
 * In other all existing details remain same only key is updated which contain that device UUID which was changed
 * Also Redis Key use Custom User ID + hash (device UUID + Custom User ID + Salt) <- Cryptographic hashing 
 * In token payload details like id: mongo id,customId: custom User Id, exp: expiry time, iat: issued at time, deviceUUID: device UUID 
 */

const redis = createClient();

const validateRedisPayloadMiddleware = async (req, res, next) => {
    try {
        const accessToken = extractAccessToken(req);
        const deviceID = req.deviceID;

        if (!accessToken) {
            logWithTime("❌ Access token missing");
            // Check from Main Memory <- Done By FrontEnd
            // If Found set in Front End and Exit <- Done By FrontEnd
            // If not found check in Local Storage <- Done By FrontEnd
            // If Found Store in M.M and set in Front end and Exit <- Done By FrontEnd
            // If not found then Means User Session has Expired
            return throwSessionExpiredError(res);
        }
        // Now Frontend check if token provided is valid via decode token if not then do following things
        // Refetch from M.M and Local Storage
        // If not fixed then do below things
        let decodedAccess;
        try {
            decodedAccess = jwt.decode(accessToken);
            if (!decodedAccess?.id) {
                // Frontend Token Headers Corrupted, forced log out all Users from this Device , Security Service will change UUID of this Device
                return throwInvalidResourceError(res, "Access token payload", "Missing or invalid user ID");
            }
        } catch {
            // Frontend Token Headers Corrupted, forced log out all Users from this Device , Security Service will change UUID of this Device
            logWithTime("❌ Failed to decode access token");
            return throwAccessDeniedError(res, "Invalid access token");
        }

        if (!redis.isOpen) await redis.connect();

        const redisKey = `auth:token:${decodedAccess.id}:${deviceID}`;
        const tokenDataRaw = await redis.get(redisKey);

        if (!tokenDataRaw) {
            logWithTime(`⚠️ Redis entry not found for userID: ${decodedAccess.id}, deviceID: ${deviceID}`);
            // Clear Headers , M.M and Local Storage
            return throwSessionExpiredError(res);
        }

        const tokenData = JSON.parse(tokenDataRaw);

        // 🔐 Decode Redis access token
        let redisDecodedAccess;
        try {
            redisDecodedAccess = jwt.decode(tokenData.accessToken);
            if (!redisDecodedAccess?.id) {
                // Security Service will perform action as Redis exploited
                logWithTime("❌ Failed to decode Redis access token");
                return throwAccessDeniedError(res, "Corrupted access token in Redis");
            }
            if (redisDecodedAccess.id !== decodedAccess.id) {
                // Token Theft, Security Service must be Informed
                logWithTime("❌ Redis access token ID mismatch");
                return throwAccessDeniedError(res, "Access token mismatch or exploit detected");
            }
        } catch {
            // A gap that Access Token in Redis is Corrupted, Security Service Help Needed
            logWithTime("❌ Failed to decode Redis access token");
            return throwAccessDeniedError(res, "Corrupted access token in Redis");
        }

        // 🔐 Decode Redis refresh token
        let redisDecodedRefresh;
        try {
            redisDecodedRefresh = jwt.decode(tokenData.refreshToken);
            if (!redisDecodedRefresh?.id || redisDecodedRefresh.id !== decodedAccess.id) {
                // Token Theft, Security Service must be Informed
                logWithTime("❌ Redis refresh token ID mismatch");
                return throwAccessDeniedError(res, "Refresh token mismatch or exploit detected");
            }
        } catch {
            // A gap that Refresh Token is Corrupted, Security Service Help Needed
            logWithTime("❌ Failed to decode Redis refresh token");
            return throwAccessDeniedError(res, "Corrupted refresh token in Redis");
        }

        // ✅ All tokens decoded and IDs match
        req.tokenMeta = {
            refreshToken: tokenData.refreshToken,
            accessToken: tokenData.accessToken,
            frontEndAccessToken: accessToken
        };

        logWithTime(`✅ Redis token payload validated for userID: ${decodedAccess.id}, deviceID: ${deviceID}`);
        next();
    } catch (err) {
        logWithTime("❌ Internal error during Redis payload validation");
        console.error(err);
        return throwInternalServerError(res);
    }
};

module.exports = { validateRedisPayloadMiddleware };
