import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { login, me, register } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);

export default router;
