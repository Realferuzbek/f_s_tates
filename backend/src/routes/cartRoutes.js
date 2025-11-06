import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getCart, updateCart } from '../controllers/cartController.js';

const router = Router();

router.use(authenticate);
router.get('/', getCart);
router.put('/', updateCart);

export default router;
