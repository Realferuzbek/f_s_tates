import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { createUserMessage, getThread, listThreads, markThreadRead } from '../controllers/chatController.js';

const router = Router();

router.use(authenticate);
router.get('/threads', listThreads);
router.get('/threads/:id', getThread);
router.post('/threads/:id/messages', createUserMessage);
router.post('/threads/:id/read', markThreadRead);

export default router;
