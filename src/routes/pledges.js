import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createPledge } from '../repositories/pledges.js';
import { getPixInstructions } from '../utils/pix.js';

const router = Router();

const validations = [
  body('donor.name').isString().trim().notEmpty(),
  body('donor.phone').isString().trim().notEmpty(),
  body('donor.message').optional().isString().trim(),
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isString().trim().notEmpty(),
  body('items.*.quantity').optional().isInt({ min: 1 }),
];

router.post('/', validations, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { donor, items } = req.body;
  const normalizedItems = items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity ?? 1,
  }));

  try {
    const pledge = await createPledge({ donor, items: normalizedItems });
    return res.status(201).json({
      data: pledge,
      pix: getPixInstructions(),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Produto')) {
      return res.status(400).json({
        errors: [
          {
            msg: error.message,
            param: 'items',
            location: 'body',
          },
        ],
      });
    }
    return next(error);
  }
});

export default router;
