import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { findUserByEmail, updateLastLogin } from '../../repositories/users.js';
import { signAccessToken } from '../../utils/jwt.js';
import { requireAdmin } from '../../middlewares/require-admin.js';

const router = Router();

const loginValidations = [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().notEmpty(),
];

router.post('/login', loginValidations, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user || !user.isActive) {
        return res.status(401).json({ errors: [{ msg: 'Credenciais inválidas' }] });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
        return res.status(401).json({ errors: [{ msg: 'Credenciais inválidas' }] });
    }

    await updateLastLogin(user._id);
    const token = signAccessToken({ sub: user._id.toString(), role: user.role });
    return res.json({
        data: {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
    });
});

router.get('/me', requireAdmin, (req, res) => {
    res.json({ data: req.user });
});

export default router;
