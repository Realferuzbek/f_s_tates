import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { getDashboard } from '../controllers/adminController.js';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN']));
router.get('/metrics', getDashboard);

export default router;
