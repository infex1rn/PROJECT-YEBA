import { Router } from 'express';
import { getSiteSettings } from '../config/settings';
const router = Router();
router.get('/', async (_req, res) => {
  try {
    const settings = await getSiteSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(503).json({ success: false, error: 'Platform configuration is unavailable' });
  }
});
export default router;
