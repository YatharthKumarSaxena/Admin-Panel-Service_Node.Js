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