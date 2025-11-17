import { Router } from 'express';
import { optionalAuthenticate } from '../middleware/authMiddleware.js';
import { trackEvent } from '../controllers/analyticsController.js';

const router = Router();

router.post('/', optionalAuthenticate, trackEvent);

export default router;
