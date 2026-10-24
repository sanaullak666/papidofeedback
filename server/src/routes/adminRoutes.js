import express from 'express';
import {
  login,
  getMe,
  getDashboardAnalytics,
  getFeedbackList,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  exportCsv,
  exportExcel,
  getActivityLogs,
  updateSettings,
} from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public auth
router.post('/login', loginLimiter, login);

// Protected Admin APIs
router.use(requireAuth);

router.get('/me', getMe);
router.get('/dashboard', getDashboardAnalytics);
router.get('/feedback', getFeedbackList);
router.get('/feedback/:id', getFeedbackById);
router.patch('/feedback/:id', updateFeedbackStatus);
router.delete('/feedback/:id', deleteFeedback);
router.get('/export/csv', exportCsv);
router.get('/export/excel', exportExcel);
router.get('/logs', getActivityLogs);
router.patch('/settings', updateSettings);

export default router;
