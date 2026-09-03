import { Router } from 'express';
import { getResources } from '../controllers/public/resources';
import { searchMessages } from '../controllers/public/search';
import { getRecentMessage } from '../controllers/public/recentMsg';
import { readMessage } from '../controllers/public/readMsg';
import { getChurchEvents } from '../controllers/public/churchEvents';
import { getUpcomingEvents } from '../controllers/public/upcomingEvents';
import { getArticles, getArticleById, searchArticles } from '../controllers/blog.controller';
import { getTodayDevotional } from '../controllers/dailyWord.controller';
import { getLiveStreamConfig } from '../controllers/liveStream.controller';

const router = Router();

router.get('/resources', getResources);
router.get('/search', searchMessages);
router.get('/recent', getRecentMessage);
router.get('/resource/:id', readMessage);
router.get('/events', getChurchEvents);
router.get('/upcoming-events', getUpcomingEvents);

// New Models Public Endpoints
router.get('/blog', getArticles);
router.get('/blog/search', searchArticles); // Must be before /blog/:id
router.get('/blog/:id', getArticleById);
router.get('/daily-word', getTodayDevotional);
router.get('/live-stream', getLiveStreamConfig);

export default router;
