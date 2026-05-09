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

const router = Router();
const upload = multer({ dest: '/tmp/uploads/' });

// Base protection against unauthenticated access
router.use(authenticateRequest);

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

export default router;
