import { Router, Response } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      res.status(400).json({ success: false, error: 'Invalid user ID' });
      return;
    }
    if (req.user!.userId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// Get designer profile
router.get('/designers/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const designerId = Number(req.params.id);
    if (!Number.isSafeInteger(designerId) || designerId <= 0) {
      res.status(400).json({ success: false, error: 'Invalid designer ID' });
      return;
    }

    const designer = await prisma.designer.findFirst({
      where: { id: designerId, user: { status: 'ACTIVE' } },
      include: {
        user: {
          select: {
            name: true,
            createdAt: true,
          },
        },
        designs: {
          where: {
            status: 'APPROVED', archivedAt: null,
          },
          select: {
            id: true,
            title: true,
            price: true,
            watermarkedPreviewUrl: true,
          },
          take: 10,
        },
      },
    });

    if (!designer) {
      res.status(404).json({ success: false, error: 'Designer not found' });
      return;
    }

    res.json({
      success: true,
      designer: {
        id: designer.id,
        name: designer.user.name,
        bio: designer.bio,
        portfolioLink: designer.portfolioLink,
        rating: designer.rating,
        memberSince: designer.user.createdAt,
        designs: designer.designs,
      },
    });
  } catch (error: any) {
    console.error('Get designer error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch designer' });
  }
});

export default router;
