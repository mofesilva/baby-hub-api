import { Router } from 'express';
import productsRouter from './products.js';
import pledgesRouter from './pledges.js';
import donationsRouter from './donations.js';

const router = Router();

router.use('/products', productsRouter);
router.use('/pledges', pledgesRouter);
router.use('/donations', donationsRouter);

export default router;
