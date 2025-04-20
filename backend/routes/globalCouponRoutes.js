import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
  createGlobalCoupon,
  listGlobalCoupons,
  deleteGlobalCoupon,
  toggleGlobalCoupon
} from '../controllers/globalCouponController.js';

const globalCouponRouter = express.Router();

// Admin routes - all require admin authentication
globalCouponRouter.post('/create', adminAuth, createGlobalCoupon);
globalCouponRouter.get('/list', adminAuth, listGlobalCoupons);
globalCouponRouter.post('/delete', adminAuth, deleteGlobalCoupon);
globalCouponRouter.post('/toggle', adminAuth, toggleGlobalCoupon);

export default globalCouponRouter;