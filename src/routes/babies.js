import { Router } from 'express';
import { listPublicBabies, getBabyProfileBySlug } from '../repositories/babies.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await listPublicBabies();
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const profile = await getBabyProfileBySlug(req.params.slug);
    if (!profile) {
      return res.status(404).json({
        errors: [
          {
            msg: 'Perfil não encontrado',
            param: 'slug',
            location: 'params',
          },
        ],
      });
    }

    return res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});

export default router;
