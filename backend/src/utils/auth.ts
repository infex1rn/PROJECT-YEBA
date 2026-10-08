import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: TokenIdentity): string => {
  return jwt.sign(payload, config.jwtSecret, { algorithm: 'HS256', expiresIn: config.jwtExpiresIn });
};

export interface TokenIdentity {
  userId: number;
  role: 'BUYER' | 'DESIGNER' | 'ADMIN';
  tokenVersion: number;
}

export const verifyToken = (token: string): TokenIdentity => {
  const decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'], maxAge: config.jwtExpiresIn });
  if (typeof decoded === 'string' || !Number.isSafeInteger(decoded.userId) || decoded.userId <= 0 ||
      !['BUYER', 'DESIGNER', 'ADMIN'].includes(decoded.role) ||
      !Number.isSafeInteger(decoded.tokenVersion) || decoded.tokenVersion < 0 ||
      !Number.isSafeInteger(decoded.exp) || !Number.isSafeInteger(decoded.iat)) {
    throw new Error('Invalid token claims');
  }
  return { userId: decoded.userId, role: decoded.role, tokenVersion: decoded.tokenVersion };
};
