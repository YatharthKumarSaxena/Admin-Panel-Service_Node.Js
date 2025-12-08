require("dotenv").config();

const { malformedJsonHandler } = require("@middlewares/handlers/malformed-json-handler.middleware");
const { unknownRouteHandler } = require("@middlewares/handlers/unknown-route-handler.middleware");
const { globalLimiter } = require("@rate-limiters/global.rate-limiter")
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

app.use(globalLimiter);

app.use(express.json());

app.use(cookieParser());

// Malformed JSON handler (agar implement kiya hai)
app.use(malformedJsonHandler);

// Routes placeholder (baad me import karenge)
// require("@routes/index.routes")(app);

// 404 handler
app.use(unknownRouteHandler);

module.exports = {
    app
}