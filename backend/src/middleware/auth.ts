import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { verifyToken, TokenIdentity } from '../utils/auth';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const match = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization || '');
  if (!match) {
    res.status(401).json({ success: false, error: 'No valid bearer token provided' });
    return;
  }
  let decoded: TokenIdentity;
  try {
    decoded = verifyToken(match[1]);
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, status: true, tokenVersion: true },
    });
  } catch (error) {
    res.status(503).json({ success: false, error: 'Authentication service unavailable. Please retry.' });
    return;
  }
  if (!user || user.status !== 'ACTIVE' || user.tokenVersion !== decoded.tokenVersion || user.role !== decoded.role) {
    res.status(401).json({ success: false, error: 'Session is no longer valid' });
    return;
  }
  req.user = { userId: user.id, role: user.role };
  next();
};

// Alias for authenticate
export const authenticateToken = authenticate;

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }
    next();
  };
};

// Helper middleware to require admin role
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }
  next();
};
