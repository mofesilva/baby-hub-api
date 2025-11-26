import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import { UserModel } from '../models/user.js';

const SALT_ROUNDS = 10;

export const findUserByEmail = async (email) =>
    UserModel.findOne({ email: email?.toLowerCase(), isDeleted: false });

export const createAdminUser = async ({ name, email, password }) => {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return UserModel.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'admin',
    });
};

export const updateLastLogin = async (userId) =>
    UserModel.findByIdAndUpdate(userId, { lastLoginAt: new Date() }, { new: true });

export const seedAdminIfNeeded = async () => {
    const { name, email, password } = config.auth?.admin || {};
    if (!email || !password) {
        console.warn('Variáveis ADMIN_EMAIL e ADMIN_PASSWORD não definidas. Pulei seed do admin.');
        return null;
    }

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) return existing;

    const user = await createAdminUser({ name: name || 'Administrador', email, password });
    console.log(`Usuário admin criado (${user.email}).`);
    return user;
};
