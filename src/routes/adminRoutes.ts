import { Router } from 'express';
import multer from 'multer';
import { uploadMessage } from '../controllers/admin/uploadMessage';
import { updateMessage } from '../controllers/admin/updateMessage';
import { deleteMessage } from '../controllers/admin/deleteMessage';
import { createEvent } from '../controllers/admin/events/createEvent';
import { updateEvent } from '../controllers/admin/events/updateEvent';
import { deleteEvent } from '../controllers/admin/events/deleteEvent';
import { createUser } from '../controllers/admin/users/createUser';
import { getUsers } from '../controllers/admin/users/getUsers';
import { updateUser } from '../controllers/admin/users/updateUser';
import { deleteUser } from '../controllers/admin/users/deleteUser';
import { authenticateRequest } from '../middlewares/auth';
import { getDashboardData } from '../controllers/admin/dashboard';
import { createArticle, updateArticle, deleteArticle } from '../controllers/blog.controller';
import { createDevotional, updateDevotional, deleteDevotional } from '../controllers/dailyWord.controller';
import { upsertLiveStream } from '../controllers/liveStream.controller';

const router = Router();
const upload = multer({ dest: '/tmp/uploads/' });

// Base protection against unauthenticated access
router.use(authenticateRequest);

router.get('/dashboard', getDashboardData);

router.post('/upload', upload.fields([
  { name: 'messageThumbnail', maxCount: 1 },
  { name: 'audioFile', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), uploadMessage);

router.put('/update/:id', upload.fields([
  { name: 'messageThumbnail', maxCount: 1 },
  { name: 'audioFile', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), updateMessage);

router.delete('/delete/:id', deleteMessage);

// Church Events Management Routes
router.post('/events', upload.single('thumbnail'), createEvent);
router.put('/events/:id', upload.single('thumbnail'), updateEvent);
router.delete('/events/:id', deleteEvent);

// Admin Users Management Routes
router.post('/users', createUser);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Blog Management Routes
router.post('/blog', createArticle);
router.put('/blog/:id', updateArticle);
router.delete('/blog/:id', deleteArticle);

// Daily Word Management Routes
router.post('/daily-word', createDevotional);
router.put('/daily-word/:id', updateDevotional);
router.delete('/daily-word/:id', deleteDevotional);

// Live Stream Management Route
router.post('/live-stream', upsertLiveStream);

export default router;
