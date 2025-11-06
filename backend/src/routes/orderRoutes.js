import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { checkout, listOrders } from '../controllers/orderController.js';

const router = Router();

router.use(authenticate);
router.get('/', listOrders);
router.post('/checkout', checkout);

export default router;
