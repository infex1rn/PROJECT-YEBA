import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { body, param, query, validationResult } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();
const safeUserSelect = { id: true, name: true, email: true, role: true, status: true, createdAt: true } as const;

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
      where: { paymentStatus: 'COMPLETED' },
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
      WHERE created_at >= ${sixMonthsAgo} AND payment_status = 'COMPLETED'
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
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// GET /api/admin/users - List all users with filters
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('role').optional().isIn(['BUYER', 'DESIGNER', 'ADMIN']),
  query('status').optional().isIn(['ACTIVE', 'SUSPENDED', 'BANNED']),
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
              earnings: true,
              rating: true,
            },
          },
          buyer: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const buyerIds = users.flatMap(user => user.buyer ? [user.buyer.id] : []);
    const spending = await prisma.transaction.groupBy({
      by: ['buyerId'],
      where: { buyerId: { in: buyerIds }, paymentStatus: 'COMPLETED' },
      _sum: { amount: true },
    });
    const spendingByBuyer = new Map(spending.map(row => [row.buyerId, row._sum.amount ?? 0]));
    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          ...user,
          designer: user.designer ? { rating: user.designer.rating, totalEarnings: user.designer.earnings } : null,
          buyer: user.buyer ? { totalSpent: spendingByBuyer.get(user.buyer.id) ?? 0 } : null,
        })),
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
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// GET /api/admin/users/:id - Get user details
router.get('/users/:id', [
  param('id').isInt({ min: 1 }).toInt(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { ...safeUserSelect, designer: true, buyer: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// PUT /api/admin/users/:id/status - Update user status
router.put('/users/:id/status', [
  param('id').isInt({ min: 1 }).toInt(),
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
      data: { status, tokenVersion: { increment: 1 } },
      select: safeUserSelect,
    });


    res.json({
      success: true,
      message: `User status updated to ${status}`,
      data: user,
    });
  } catch (error: any) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', [
  param('id').isInt({ min: 1 }).toInt(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const userId = parseInt(req.params.id);

    await prisma.user.update({
      where: { id: userId }, data: { status: 'BANNED', tokenVersion: { increment: 1 } },
    });

    res.json({
      success: true,
      message: 'Account deactivated; financial records retained',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// GET /api/admin/designs - List all designs with filters
router.get('/designs', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED']),
  query('category').optional().trim(),
  query('search').optional().trim().isLength({ max: 200 }),
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

    const search = req.query.search as string;
    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };

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
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// PUT /api/admin/designs/:id/moderate - Moderate design
router.put('/designs/:id/moderate', [
  param('id').isInt({ min: 1 }).toInt(),
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
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// DELETE /api/admin/designs/:id - Delete design
router.delete('/designs/:id', [
  param('id').isInt({ min: 1 }).toInt(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const designId = parseInt(req.params.id);

    await prisma.design.update({
      where: { id: designId }, data: { archivedAt: new Date() },
    });

    res.json({
      success: true,
      message: 'Design archived; financial records retained',
    });
  } catch (error: any) {
    console.error('Error deleting design:', error);
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// GET /api/admin/transactions - List all transactions
router.get('/transactions', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['PENDING', 'COMPLETED', 'FAILED']),
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
    if (status) where.paymentStatus = status;

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
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// GET /api/admin/transactions/:id - Get transaction details
router.get('/transactions/:id', [
  param('id').isInt({ min: 1 }).toInt(),
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
            user: { select: safeUserSelect },
          },
        },
        design: {
          include: {
            designer: {
              include: {
                user: { select: safeUserSelect },
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
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// PUT /api/admin/transactions/:id/refund - Process refund
router.put('/transactions/:id/refund', [
  param('id').isInt({ min: 1 }).toInt(),
  body('reason').optional().trim(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  res.status(503).json({ success: false, error: 'Refunds are unavailable because a payment provider is not configured' });
});

// GET /api/admin/withdrawals - List all withdrawals
router.get('/withdrawals', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']),
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
    res.status(500).json({ success: false, error: 'Unable to complete administrator request' });
  }
});

// PUT /api/admin/withdrawals/:id/process - Process withdrawal
router.put('/withdrawals/:id/process', [
  param('id').isInt({ min: 1 }).toInt(),
  body('status').isIn(['APPROVED', 'REJECTED']),
  body('reason').optional().trim(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  if (req.body.status === 'APPROVED') {
    return res.status(503).json({ success: false, error: 'Payouts are unavailable because a payment provider is not configured' });
  }
  try {
    const result = await prisma.withdrawal.updateMany({
      where: { id: Number(req.params.id), status: 'PENDING' },
      data: { status: 'REJECTED', processedAt: new Date() },
    });
    if (!result.count) {
      return res.status(409).json({ success: false, error: 'Withdrawal is missing or no longer pending' });
    }
    res.json({ success: true, message: 'Withdrawal rejected' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Unable to reject withdrawal' });
  }
});

const reportStatuses = z.enum(['PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED', 'FLAGGED']);
const reportTypes = z.enum(['DESIGN', 'USER', 'REVIEW', 'MESSAGE']);
const reportQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: reportTypes.optional(), status: reportStatuses.optional(),
});

router.get('/reports', async (req, res) => {
  const parsed = reportQuery.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Invalid report filters' });
  const { page, limit, type, status } = parsed.data;
  try {
    const where = { type, status };
    const [reports, total] = await prisma.$transaction([
      prisma.report.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] }),
      prisma.report.count({ where }),
    ]);
    res.json({ success: true, data: { reports, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Unable to load reports' });
  }
});

const reportDecision = z.object({
  status: reportStatuses.exclude(['PENDING']), expectedStatus: reportStatuses,
  resolution: z.string().trim().min(3).max(2000),
}).strict();
router.put('/reports/:id/status', async (req: AuthRequest, res) => {
  const id = z.coerce.number().int().positive().safeParse(req.params.id);
  const parsed = reportDecision.safeParse(req.body);
  if (!id.success || !parsed.success) return res.status(400).json({ success: false, error: 'Invalid report decision' });
  const { status, expectedStatus, resolution } = parsed.data;
  if (['RESOLVED', 'DISMISSED'].includes(expectedStatus)) {
    return res.status(409).json({ success: false, error: 'This report is already closed' });
  }
  try {
    const changed = await prisma.report.updateMany({
      where: { id: id.data, status: expectedStatus },
      data: { status, resolution, moderatorId: req.user!.userId, resolvedAt: ['RESOLVED', 'DISMISSED'].includes(status) ? new Date() : null },
    });
    if (!changed.count) return res.status(409).json({ success: false, error: 'The report changed or no longer exists. Refresh and retry.' });
    res.json({ success: true, message: 'Report decision saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Unable to save report decision' });
  }
});

router.put('/users/:id/verification', async (req, res) => {
  const id = z.coerce.number().int().positive().safeParse(req.params.id);
  const parsed = z.object({ verified: z.boolean() }).strict().safeParse(req.body);
  if (!id.success || !parsed.success) return res.status(400).json({ success: false, error: 'Invalid account verification' });
  try {
    const result = await prisma.user.updateMany({ where: { id: id.data }, data: parsed.data });
    if (!result.count) return res.status(404).json({ success: false, error: 'Account not found' });
    res.json({ success: true, message: 'Account verification saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Unable to save account verification' });
  }
});

router.get('/settings', async (_req, res) => {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!settings) return res.status(503).json({ success: false, error: 'Platform configuration is unavailable' });
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(503).json({ success: false, error: 'Unable to load platform configuration' });
  }
});
const settingsInput = z.object({
  version: z.number().int().nonnegative(), maintenanceMode: z.boolean(), userRegistration: z.boolean(), designApproval: z.boolean(),
  categories: z.array(z.string().trim().min(1).max(60)).min(1).max(50)
    .refine(values => new Set(values.map(value => value.toLowerCase())).size === values.length, 'Categories must be unique'),
}).strict();
router.put('/settings', async (req, res) => {
  const parsed = settingsInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Invalid platform settings', errors: parsed.error.issues });
  const { version, ...settings } = parsed.data;
  try {
    const result = await prisma.siteSettings.updateMany({ where: { id: 1, version }, data: { ...settings, version: { increment: 1 } } });
    if (!result.count) return res.status(409).json({ success: false, error: 'Settings changed. Reload before saving again.' });
    res.json({ success: true, message: 'Platform settings saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Unable to save platform settings' });
  }
});

export default router;
