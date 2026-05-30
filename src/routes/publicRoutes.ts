import { Router } from 'express';
import { getResources } from '../controllers/public/resources';
import { searchMessages } from '../controllers/public/search';
import { getRecentMessage } from '../controllers/public/recentMsg';
import { readMessage } from '../controllers/public/readMsg';
import { getChurchEvents } from '../controllers/public/churchEvents';
import { getUpcomingEvents } from '../controllers/public/upcomingEvents';

const router = Router();

router.get('/resources', getResources);
router.get('/search', searchMessages);
router.get('/recent', getRecentMessage);
router.get('/resource/:id', readMessage);
router.get('/events', getChurchEvents);
router.get('/upcoming-events', getUpcomingEvents);

export default router;
