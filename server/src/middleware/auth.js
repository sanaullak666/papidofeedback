import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { query } from '../db/connection.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required.',
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please sign in again.',
      });
    }

    const users = await query(
      'SELECT id, username, email, name, role FROM admin_users WHERE id = ? LIMIT 1;',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.',
      });
    }

    req.user = users[0];
    next();
  } catch (err) {
    console.error('[AuthMiddleware] Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal authorization error.',
    });
  }
}
