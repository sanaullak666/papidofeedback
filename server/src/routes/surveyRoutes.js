import express from 'express';
import { submitSurvey, getPublicSettings } from '../controllers/surveyController.js';
import { submitSurveyLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/settings', getPublicSettings);
router.post('/submit', submitSurveyLimiter, submitSurvey);

export default router;
