import { Router } from 'express';
import productsRouter from './products.js';
import pledgesRouter from './pledges.js';
import donationsRouter from './donations.js';
import adminAuthRouter from './admin/auth.js';
import adminUploadsRouter from './admin/uploads.js';
import babiesRouter from './babies.js';

const router = Router();

router.use('/products', productsRouter);
router.use('/pledges', pledgesRouter);
router.use('/donations', donationsRouter);
router.use('/admin/auth', adminAuthRouter);
router.use('/babies', babiesRouter);
router.use('/admin/uploads', adminUploadsRouter);

export default router;
