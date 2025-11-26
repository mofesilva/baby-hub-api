import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { recordDonation } from '../repositories/donations.js';
import { findPledgeById } from '../repositories/pledges.js';

const router = Router();

const validations = [
  body('pledgeId').isString().trim().notEmpty(),
  body('donor.name').isString().trim().notEmpty(),
  body('donor.phone').isString().trim().notEmpty(),
  body('pixProof').optional().isString().trim(),
];

router.post('/', validations, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pledgeId, donor, pixProof } = req.body;

  try {
    const pledge = await findPledgeById(pledgeId);
    if (!pledge) {
      return res.status(404).json({
        errors: [
          {
            msg: 'Pledge não encontrado',
            param: 'pledgeId',
            location: 'body',
          },
        ],
      });
    }

    const donation = await recordDonation({ donor, pledgeId, pixProof });
    return res.status(201).json({ data: donation });
  } catch (error) {
    if (error?.name === 'CastError') {
      return res.status(400).json({
        errors: [
          {
            msg: 'Identificador de pledge inválido',
            param: 'pledgeId',
            location: 'body',
          },
        ],
      });
    }
    return next(error);
  }
});

export default router;
