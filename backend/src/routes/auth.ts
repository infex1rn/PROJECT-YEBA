import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

import { getSiteSettings } from '../config/settings';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Register Buyer
router.post(
  '/register/buyer',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      if (!(await getSiteSettings()).userRegistration) {
        res.status(403).json({ success: false, error: 'New account registration is currently closed' });
        return;
      }
      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(409).json({ success: false, error: 'User already exists' });
        return;
      }

      // Create user and buyer
      const passwordHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'BUYER',
          buyer: {
            create: {},
          },
        },
        include: {
          buyer: true,
        },
      });

      const token = generateToken({ userId: user.id, role: user.role, tokenVersion: user.tokenVersion });

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      console.error('Register buyer error:', error);
      res.status(500).json({ success: false, error: 'Registration failed' });
    }
  }
);

// Register Designer
router.post(
  '/register/designer',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('bio').optional().trim(),
    body('portfolioLink').optional().isURL().withMessage('Valid URL required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      if (!(await getSiteSettings()).userRegistration) {
        res.status(403).json({ success: false, error: 'New account registration is currently closed' });
        return;
      }
      const { name, email, password, bio, portfolioLink } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(409).json({ success: false, error: 'User already exists' });
        return;
      }

      const passwordHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'DESIGNER',
          designer: {
            create: {
              bio: bio || null,
              portfolioLink: portfolioLink || null,
            },
          },
        },
        include: {
          designer: true,
        },
      });

      const token = generateToken({ userId: user.id, role: user.role, tokenVersion: user.tokenVersion });

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        designer: user.designer,
        token,
      });
    } catch (error: any) {
      console.error('Register designer error:', error);
      res.status(500).json({ success: false, error: 'Registration failed' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          designer: true,
          buyer: true,
        },
      });

      if (!user || user.status !== 'ACTIVE') {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const isValidPassword = await comparePassword(password, user.passwordHash);
      if (!isValidPassword) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const token = generateToken({ userId: user.id, role: user.role, tokenVersion: user.tokenVersion });

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Login failed' });
    }
  }
);

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    if (!user) return res.status(401).json({ success: false, error: 'Session is no longer valid' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(503).json({ success: false, error: 'Unable to load session; please retry' });
  }
});

router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.update({ where: { id: req.user!.userId }, data: { tokenVersion: { increment: 1 } } });
    res.json({ success: true });
  } catch (error) {
    res.status(503).json({ success: false, error: 'Unable to revoke session; please retry' });
  }
});

export default router;
