import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const submission = z.object({
  type: z.enum(['DESIGN', 'USER', 'REVIEW', 'MESSAGE']),
  subjectId: z.number().int().positive(),
  reason: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(4000),
}).strict();

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const parsed = submission.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Invalid report', errors: parsed.error.issues });
  const { type, subjectId, reason, description } = parsed.data;
  try {
    let visible = false;
    if (type === 'DESIGN') {
      visible = !!await prisma.design.findFirst({ where: {
        id: subjectId, archivedAt: null,
        OR: [{ status: 'APPROVED' }, { designer: { userId: req.user!.userId } }],
      }, select: { id: true } });
    } else if (type === 'USER') {
      visible = !!await prisma.user.findUnique({ where: { id: subjectId }, select: { id: true } });
    } else if (type === 'REVIEW') {
      visible = !!await prisma.review.findUnique({ where: { id: subjectId }, select: { id: true } });
    } else {
      visible = !!await prisma.message.findFirst({ where: {
        id: subjectId, OR: [{ senderId: req.user!.userId }, { receiverId: req.user!.userId }],
      }, select: { id: true } });
    }
    if (!visible) return res.status(404).json({ success: false, error: 'Report subject not found or not accessible' });
    const report = await prisma.report.create({ data: { type, subjectId, reason, description, reporterId: req.user!.userId } });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Unable to submit report' });
  }
});
export default router;
