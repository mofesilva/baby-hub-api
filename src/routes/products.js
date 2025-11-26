import { Router } from 'express';
import { listProducts } from '../repositories/products.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await listProducts();
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

export default router;
