import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { getDashboard } from '../controllers/adminController.js';
import { adminSendMessage, listAdminThreads, markThreadReadByAdmin } from '../controllers/adminChatController.js';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN']));
router.get('/metrics', getDashboard);
router.get('/chat/threads', listAdminThreads);
router.post('/chat/threads/:id/messages', adminSendMessage);
router.post('/chat/threads/:id/read', markThreadReadByAdmin);

export default router;
