import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all designs (public)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('category').optional().trim(),
    query('search').optional().trim(),
    query('sortBy').optional().isIn(['popular', 'newest', 'price-low', 'price-high', 'rating']),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'newest';

      const skip = (page - 1) * limit;

      const where: any = {
        status: 'APPROVED',
      };

      if (category) {
        where.category = category;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      let orderBy: any = { createdAt: 'desc' };
      if (sortBy === 'price-low') orderBy = { price: 'asc' };
      if (sortBy === 'price-high') orderBy = { price: 'desc' };

      const [designs, total] = await Promise.all([
        prisma.design.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            designer: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        }),
        prisma.design.count({ where }),
      ]);

      res.json({
        success: true,
        designs: designs.map(d => ({
          id: d.id,
          title: d.title,
          description: d.description,
          category: d.category,
          price: d.price,
          watermarkedPreviewUrl: d.watermarkedPreviewUrl,
          designer: {
            id: d.designer.id,
            name: d.designer.user.name,
            rating: d.designer.rating,
          },
          createdAt: d.createdAt,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    } catch (error: any) {
      console.error('Get designs error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch designs' });
    }
  }
);

// Get single design
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const designId = parseInt(req.params.id);

    const design = await prisma.design.findUnique({
      where: { id: designId },
      include: {
        designer: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!design) {
      res.status(404).json({ success: false, error: 'Design not found' });
      return;
    }

    res.json({
      success: true,
      design: {
        id: design.id,
        title: design.title,
        description: design.description,
        category: design.category,
        price: design.price,
        watermarkedPreviewUrl: design.watermarkedPreviewUrl,
        status: design.status,
        designer: {
          id: design.designer.id,
          name: design.designer.user.name,
          rating: design.designer.rating,
          bio: design.designer.bio,
        },
        createdAt: design.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Get design error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch design' });
  }
});

// Create design (designers only)
router.post(
  '/',
  authenticate,
  authorize('DESIGNER'),
  [
    body('title').trim().notEmpty().isLength({ min: 3, max: 100 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('category').trim().notEmpty(),
    body('price').isFloat({ min: 1 }),
    body('fileUrl').trim().notEmpty().isURL(),
    body('watermarkedPreviewUrl').trim().notEmpty().isURL(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const { title, description, category, price, fileUrl, watermarkedPreviewUrl } = req.body;
      const userId = req.user!.userId;

      // Get designer ID
      const designer = await prisma.designer.findUnique({
        where: { userId },
      });

      if (!designer) {
        res.status(404).json({ success: false, error: 'Designer profile not found' });
        return;
      }

      const design = await prisma.design.create({
        data: {
          designerId: designer.id,
          title,
          description,
          category,
          price: parseFloat(price),
          fileUrl,
          watermarkedPreviewUrl,
          status: 'PENDING',
        },
      });

      res.status(201).json({
        success: true,
        design: {
          id: design.id,
          title: design.title,
          status: design.status,
          fileUrl: design.fileUrl,
          watermarkedPreviewUrl: design.watermarkedPreviewUrl,
        },
      });
    } catch (error: any) {
      console.error('Create design error:', error);
      res.status(500).json({ success: false, error: 'Failed to create design' });
    }
  }
);

// Update design (designers only, own designs)
router.put(
  '/:id',
  authenticate,
  authorize('DESIGNER'),
  [
    body('title').optional().trim().isLength({ min: 3, max: 100 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('price').optional().isFloat({ min: 1 }),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const designId = parseInt(req.params.id);
      const userId = req.user!.userId;

      const designer = await prisma.designer.findUnique({
        where: { userId },
      });

      if (!designer) {
        res.status(404).json({ success: false, error: 'Designer profile not found' });
        return;
      }

      const design = await prisma.design.findUnique({
        where: { id: designId },
      });

      if (!design) {
        res.status(404).json({ success: false, error: 'Design not found' });
        return;
      }

      if (design.designerId !== designer.id) {
        res.status(403).json({ success: false, error: 'Not authorized to update this design' });
        return;
      }

      const { title, description, price } = req.body;
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (price) updateData.price = parseFloat(price);

      const updatedDesign = await prisma.design.update({
        where: { id: designId },
        data: updateData,
      });

      res.json({
        success: true,
        design: updatedDesign,
      });
    } catch (error: any) {
      console.error('Update design error:', error);
      res.status(500).json({ success: false, error: 'Failed to update design' });
    }
  }
);

// Delete design (designers only, own designs)
router.delete(
  '/:id',
  authenticate,
  authorize('DESIGNER'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const designId = parseInt(req.params.id);
      const userId = req.user!.userId;

      const designer = await prisma.designer.findUnique({
        where: { userId },
      });

      if (!designer) {
        res.status(404).json({ success: false, error: 'Designer profile not found' });
        return;
      }

      const design = await prisma.design.findUnique({
        where: { id: designId },
      });

      if (!design) {
        res.status(404).json({ success: false, error: 'Design not found' });
        return;
      }

      if (design.designerId !== designer.id) {
        res.status(403).json({ success: false, error: 'Not authorized to delete this design' });
        return;
      }

      await prisma.design.delete({
        where: { id: designId },
      });

      res.json({
        success: true,
        message: 'Design deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete design error:', error);
      res.status(500).json({ success: false, error: 'Failed to delete design' });
    }
  }
);

export default router;
