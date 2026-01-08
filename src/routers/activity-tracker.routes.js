// ========== 👑 ACTIVITY TRACKER ROUTES ==========


const express = require("express");
const activityTrackerRoutes = express.Router();
const { ACTIVITY_TRACKING_ROUTES } = require("@configs/uri.config");

const {
    FETCH_ACTIVITY_LOGS,
    LIST_ACTIVITY_TRACKS,
    FETCH_MY_ACTIVITY_LOGS
} = ACTIVITY_TRACKING_ROUTES;

// Controllers
const { activityTrackerControllers } = require("@controllers/activity-trackers/index");

// Middlewares
const { activityTrackerMiddlewares } = require("@middlewares/activity-trackers/index");
const { baseMiddlewares } = require("./middleware.gateway");

// Rate Limiters
const {
    fetchActivityLogsLimiter,
    listActivityTracksLimiter,
    fetchMyActivityLogsLimiter
} = require("@/rate-limiters/index");

// Fetch Activity Logs - Admins
activityTrackerRoutes.get(`${FETCH_ACTIVITY_LOGS}`,
    [
        fetchActivityLogsLimiter,
        ...baseMiddlewares,
        activityTrackerMiddlewares.validateViewAdminActivityTrackerRequestBody,
        activityTrackerMiddlewares.validateViewAdminActivityTrackerFields
    ],
    activityTrackerControllers.viewAdminActivityTracker);

// List Activity Tracks - Admins
activityTrackerRoutes.get(`${LIST_ACTIVITY_TRACKS}`,
    [
        listActivityTracksLimiter,
        ...baseMiddlewares,
    ],
    activityTrackerControllers.listActivityTracker);

// Fetch My Activity Logs - Admins
activityTrackerRoutes.get(`${FETCH_MY_ACTIVITY_LOGS}`,
    [
        fetchMyActivityLogsLimiter,
        ...baseMiddlewares
    ],
    activityTrackerControllers.viewOwnActivityTracker);

module.exports = {
    activityTrackerRoutes
};