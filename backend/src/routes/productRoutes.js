import { Router } from 'express';
import { getProduct, listCategories, listProducts } from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/categories', listCategories);
router.get('/:productId', getProduct);

export default router;
