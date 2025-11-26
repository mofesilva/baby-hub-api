import jwt from 'jsonwebtoken';
import config from '../config/env.js';

const { secret, expiresIn } = config.auth.jwt;

export const signAccessToken = (payload, options = {}) =>
    jwt.sign(payload, secret, { expiresIn, ...options });

export const verifyAccessToken = (token) => jwt.verify(token, secret);
