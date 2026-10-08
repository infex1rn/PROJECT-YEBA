import { NextFunction, Response } from 'express';
import prisma from './database';
import { authenticate, AuthRequest } from '../middleware/auth';

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) throw new Error('Site settings have not been initialized by migrations');
  return settings;
}

export async function enforceMaintenance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await getSiteSettings();
    if (!settings.maintenanceMode || /^\/(admin(?:\/|$)|settings\/?$|auth\/(login|me|logout)\/?$)/.test(req.path)) {
      next();
      return;
    }
    if (req.headers.authorization) {
      await authenticate(req, res, () => {});
      if (res.headersSent) return;
      if (req.user?.role === 'ADMIN') {
        next();
        return;
      }
    }
    res.status(503).json({ success: false, error: 'The marketplace is undergoing maintenance. Please try again later.' });
  } catch (error) {
    res.status(503).json({ success: false, error: 'Platform configuration is unavailable. Please retry.' });
  }
}
