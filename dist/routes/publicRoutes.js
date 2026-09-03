"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resources_1 = require("../controllers/public/resources");
const search_1 = require("../controllers/public/search");
const recentMsg_1 = require("../controllers/public/recentMsg");
const readMsg_1 = require("../controllers/public/readMsg");
const churchEvents_1 = require("../controllers/public/churchEvents");
const upcomingEvents_1 = require("../controllers/public/upcomingEvents");
const blog_controller_1 = require("../controllers/blog.controller");
const dailyWord_controller_1 = require("../controllers/dailyWord.controller");
const liveStream_controller_1 = require("../controllers/liveStream.controller");
const router = (0, express_1.Router)();
router.get('/resources', resources_1.getResources);
router.get('/search', search_1.searchMessages);
router.get('/recent', recentMsg_1.getRecentMessage);
router.get('/resource/:id', readMsg_1.readMessage);
router.get('/events', churchEvents_1.getChurchEvents);
router.get('/upcoming-events', upcomingEvents_1.getUpcomingEvents);
// New Models Public Endpoints
router.get('/blog', blog_controller_1.getArticles);
router.get('/blog/search', blog_controller_1.searchArticles); // Must be before /blog/:id
router.get('/blog/:id', blog_controller_1.getArticleById);
router.get('/daily-word', dailyWord_controller_1.getTodayDevotional);
router.get('/live-stream', liveStream_controller_1.getLiveStreamConfig);
exports.default = router;
