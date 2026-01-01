import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { body, param, query, validationResult } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();

// Middleware: All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Get current counts
    const [totalUsers, totalDesigners, totalBuyers, totalDesigns, totalTransactions] = await Promise.all([
      prisma.user.count(),
      prisma.designer.count(),
      prisma.buyer.count(),
      prisma.design.count(),
      prisma.transaction.count(),
    ]);

    // Get designs by status
    const designsByStatus = await prisma.design.groupBy({
      by: ['status'],
      _count: true,
    });

    const pendingDesigns = designsByStatus.find(d => d.status === 'PENDING')?._count || 0;
    const approvedDesigns = designsByStatus.find(d => d.status === 'APPROVED')?._count || 0;
    const rejectedDesigns = designsByStatus.find(d => d.status === 'REJECTED')?._count || 0;

    // Get revenue
    const revenueResult = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' },
    });
    const totalRevenue = revenueResult._sum.amount || 0;

    // Get pending withdrawals
    const pendingWithdrawals = await prisma.withdrawal.aggregate({
      _sum: { amount: true },
      _count: true,
      where: { status: 'PENDING' },
    });

    // Get monthly user growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyUsers = await prisma.$queryRaw<Array<{ month: string; count: number }>>`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        COUNT(*)::integer as count
      FROM users
      WHERE created_at >= ${sixMonthsAgo}
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `;

    // Get monthly sales (last 6 months)
    const monthlySales = await prisma.$queryRaw<Array<{ month: string; sales: number }>>`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        SUM(amount)::float as sales
      FROM transactions
      WHERE created_at >= ${sixMonthsAgo} AND status = 'COMPLETED'
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDesigners,
        totalBuyers,
        totalDesigns,
        approvedDesigns,
        pendingDesigns,
        rejectedDesigns,
        totalRevenue,
        totalTransactions,
        pendingWithdrawals: {
          amount: pendingWithdrawals._sum.amount || 0,
          count: pendingWithdrawals._count || 0,
        },
        monthlyUsers: monthlyUsers.map(m => ({ month: m.month, users: m.count })),
        monthlySales: monthlySales.map(m => ({ month: m.month, sales: m.sales })),
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/users - List all users with filters
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('role').optional().isIn(['BUYER', 'DESIGNER', 'ADMIN']),
  query('status').optional().isIn(['ACTIVE', 'SUSPENDED', 'PENDING', 'BANNED']),
  query('search').optional().trim(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const role = req.query.role as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const where: any = {};

    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          verified: true,
          createdAt: true,
          designer: {
            select: {
              totalEarnings: true,
              rating: true,
            },
          },
          buyer: {
            select: {
              totalSpent: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/users/:id - Get user details
router.get('/users/:id', [
  param('id').isInt().toInt(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        designer: true,
        buyer: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/users/:id/status - Update user status
router.put('/users/:id/status', [
  param('id').isInt().toInt(),
  body('status').isIn(['ACTIVE', 'SUSPENDED', 'BANNED']),
  body('reason').optional().trim(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const userId = parseInt(req.params.id);
    const { status, reason } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    // TODO: Send email notification to user about status change

    res.json({
      success: true,
      message: `User status updated to ${status}`,
      data: user,
    });
  } catch (error: any) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', [
  param('id').isInt().toInt(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const userId = parseInt(req.params.id);

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/designs - List all designs with filters
router.get('/designs', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED']),
  query('category').optional().trim(),
  query('designerId').optional().isInt().toInt(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const category = req.query.category as string;
    const designerId = req.query.designerId ? parseInt(req.query.designerId as string) : undefined;

    const where: any = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (designerId) where.designerId = designerId;

    const [designs, total] = await Promise.all([
      prisma.design.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          designer: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
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
      data: {
        designs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/designs/:id/moderate - Moderate design
router.put('/designs/:id/moderate', [
  param('id').isInt().toInt(),
  body('status').isIn(['APPROVED', 'REJECTED', 'FLAGGED']),
  body('reason').optional().trim(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const designId = parseInt(req.params.id);
    const { status, reason } = req.body;

    const design = await prisma.design.update({
      where: { id: designId },
      data: { status },
    });

    // TODO: Send email notification to designer about moderation decision

    res.json({
      success: true,
      message: `Design ${status.toLowerCase()}`,
      data: design,
    });
  } catch (error: any) {
    console.error('Error moderating design:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/admin/designs/:id - Delete design
router.delete('/designs/:id', [
  param('id').isInt().toInt(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const designId = parseInt(req.params.id);

    await prisma.design.delete({
      where: { id: designId },
    });

    res.json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting design:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/transactions - List all transactions
router.get('/transactions', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const where: any = {};
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          buyer: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          design: {
            select: {
              title: true,
              price: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/transactions/:id - Get transaction details
router.get('/transactions/:id', [
  param('id').isInt().toInt(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const transactionId = parseInt(req.params.id);

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        buyer: {
          include: {
            user: true,
          },
        },
        design: {
          include: {
            designer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (error: any) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/transactions/:id/refund - Process refund
router.put('/transactions/:id/refund', [
  param('id').isInt().toInt(),
  body('reason').optional().trim(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const transactionId = parseInt(req.params.id);
    const { reason } = req.body;

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'REFUNDED' },
    });

    // TODO: Process actual refund with payment gateway
    // TODO: Send email notifications

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: transaction,
    });
  } catch (error: any) {
    console.error('Error processing refund:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/withdrawals - List all withdrawals
router.get('/withdrawals', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED']),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const where: any = {};
    if (status) where.status = status;

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          designer: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.withdrawal.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        withdrawals,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/withdrawals/:id/process - Process withdrawal
router.put('/withdrawals/:id/process', [
  param('id').isInt().toInt(),
  body('status').isIn(['APPROVED', 'REJECTED']),
  body('reason').optional().trim(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const withdrawalId = parseInt(req.params.id);
    const { status, reason } = req.body;

    const withdrawal = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { 
        status,
        processedAt: new Date(),
      },
    });

    // TODO: Process actual payout if approved
    // TODO: Send email notification

    res.json({
      success: true,
      message: `Withdrawal ${status.toLowerCase()}`,
      data: withdrawal,
    });
  } catch (error: any) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/reports - List all reports
router.get('/reports', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('type').optional().isIn(['DESIGN', 'USER', 'REVIEW']),
  query('status').optional().isIn(['PENDING', 'RESOLVED']),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as string;
    const status = req.query.status as string;

    // For now, return empty array as reports table needs to be added to schema
    // This is a placeholder for when the reports table is implemented

    res.json({
      success: true,
      data: {
        reports: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
