import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

export const submitSurveyLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 mins
  max: config.rateLimit.max, // max 20 submissions per IP in 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many survey submissions received from your connection. Please try again later.',
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // max 15 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. For security reasons, please wait a few minutes before trying again.',
  },
});
