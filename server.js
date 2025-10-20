// 📁 This is the File from where the whole Project Will Start Running
// 📁 Entry Point of the Project

require("dotenv").config(); // Installed Node.js package

// ✅ Trigger scheduled jobs on server start

require("./cron-jobs"); // 👈 This will auto-load index.js by default

// 🔹 Extracting Required Modules to make Our Application
const express = require("express"); // Extract Express Module
const mongoose = require("mongoose"); // Extract Mongoose Module
const { PORT_NUMBER } = require("./configs/server.config");
const app = express(); // App is an Express Function
const { DB_URL } = require("./configs/db.config");
const {errorMessage} = require("./configs/error-handler.configs");
const { logWithTime } = require("./utils/time-stamps.utils");
const { globalErrorHandler } = require("./configs/server-error-handler.config");
const cookieParser = require("cookie-parser");
const { TOO_MANY_REQUESTS } = require("./configs/http-status.config");

app.use(cookieParser()); // ✅ Makes req.cookies accessible

mongoose.connect(DB_URL); // Specifying where to connect

const db = mongoose.connection; // Ordering to Connect

// 🔹 And password + random text are encrypted to make password more complicated to crackIf MongoDB is not connected 
db.on("error",(err)=>{
    logWithTime("⚠️ Error Occured while Connecting to Database");
    errorMessage(err);
    return;
})

// 🔹 And password + random text are encrypted to make password more complicated to crackIf MongoDB is connected successfully
db.once("open",()=>{
    logWithTime("✅ Connection estabalished with MongoDB Succesfully");
    init();
})

// 🔹 Mount All Routes via Centralized Router Index
require("./routers/index.routes")(app);

// 404 Route Handler (for undefined endpoints)
app.use(async (req, res, next) => {
    const deviceID = req.headers["x-device-uuid"];
    req.deviceID = deviceID;

    if (!deviceID) {
        logWithTime("🕵️ No Device ID in request (404 or unauthorized), skipping rate limit silently.");
        return next();
    }

    try {
        const { shouldBlockRequest, getRateLimitMeta, incrementRateLimitCount } = require("./services/rate-limiter.service");

        const routeKey = `UNKNOWN_OR_UNAUTHORIZED_${req.method}_${req.originalUrl}`;
        const { requestCount, lastRequestAt } = await getRateLimitMeta(deviceID, routeKey);

        if (shouldBlockRequest(requestCount, lastRequestAt)) {
            logWithTime(`🚫 Too many unauthorized/invalid requests from device: ${deviceID}`);
            const TIME_WINDOW_MS = 60 * 1000; // 60 Seconds

            let retryAfterSeconds = 1;
            if (typeof lastRequestAt === "number") {
                const msRemaining = TIME_WINDOW_MS - (Date.now() - lastRequestAt);
                retryAfterSeconds = msRemaining > 0 ? Math.ceil(msRemaining / 1000) : 1;
            } else {
                logWithTime(`⚠️ lastRequestAt is invalid or missing: ${lastRequestAt}`);
            }

            res.set("Retry-After", retryAfterSeconds);

            return res.status(TOO_MANY_REQUESTS).json({
            success: false,
                type: "RateLimitExceeded",
                message: "Too many invalid/unauthorized requests. Please slow down.",
                retryAfterSeconds,
            });
        }

        await incrementRateLimitCount(deviceID, routeKey);
        logWithTime(`🔁 Rate counted for unauthorized/missing route from device: ${deviceID}`);
        return next();

    } catch (err) {
        logWithTime("⚠️ Error in jugaadu 404/unauthorized route limiter");
        console.error(err);
        return next(); // don't break flow
    }
});


app.use((req, res) => {
  logWithTime(`❌ 404 - API Route Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "❌ API Route Not Found!" });
});

// Attach malformed JSON handler before any routes
app.use(malformedJsonHandler);

// 🔹 Global Error Handler (must be last middleware)
app.use(globalErrorHandler);

// 🔹 Initializing Server by Express
app.listen(PORT_NUMBER,()=>{
    // Check Server is Running or not
    logWithTime("🚀 Server has Started at Port Number: "+PORT_NUMBER); 
});