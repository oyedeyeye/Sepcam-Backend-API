import { Router } from 'express';
import { loginUser } from '../controllers/user/login';

const router = Router();

router.post('/login', loginUser as any);

export default router;
