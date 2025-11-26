import { verifyAccessToken } from '../utils/jwt.js';
import { UserModel } from '../models/user.js';

export const requireAdmin = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      errors: [
        {
          msg: 'Token ausente',
          param: 'authorization',
          location: 'headers',
        },
      ],
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await UserModel.findOne({ _id: decoded.sub, isDeleted: false, isActive: true }).lean();
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Acesso negado' }] });
    }

    req.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    return next();
  } catch (error) {
    return res.status(401).json({ errors: [{ msg: 'Token inválido ou expirado' }] });
  }
};
