import { Router } from 'express';
import multer from 'multer';
import { uploadMessage } from '../controllers/admin/uploadMessage';
import { updateMessage } from '../controllers/admin/updateMessage';
import { deleteMessage } from '../controllers/admin/deleteMessage';
import { authenticateRequest } from '../middlewares/auth';

const router = Router();
const upload = multer({ dest: '/tmp/uploads/' });

// Base protection against unauthenticated access
router.use(authenticateRequest as any);

router.post('/upload', upload.fields([
  { name: 'messageThumbnail', maxCount: 1 },
  { name: 'audioFile', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), uploadMessage as any);

router.put('/update/:id', updateMessage as any);
router.delete('/delete/:id', deleteMessage as any);

export default router;
