import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  changePassword,
  createAddress,
  createPaymentMethod,
  deleteAddress,
  deletePaymentMethod,
  getAccountOrder,
  getAccountOverview,
  getPreferences,
  listAccountOrders,
  listAddresses,
  listPaymentMethods,
  updateAccountProfile,
  updateAddress,
  updatePreferences
} from '../controllers/accountController.js';

const router = Router();

router.use(authenticate);

router.get('/me', getAccountOverview);
router.put('/me', updateAccountProfile);

router.get('/orders', listAccountOrders);
router.get('/orders/:id', getAccountOrder);

router.get('/addresses', listAddresses);
router.post('/addresses', createAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

router.get('/payment-methods', listPaymentMethods);
router.post('/payment-methods', createPaymentMethod);
router.delete('/payment-methods/:id', deletePaymentMethod);

router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

router.post('/change-password', changePassword);

export default router;
