import { query } from '../db/connection.js';

export async function logAdminActivity({
  adminId = null,
  adminEmail = null,
  action,
  targetType = null,
  targetId = null,
  details = null,
  ip = null,
}) {
  try {
    await query(
      `INSERT INTO admin_activity_logs (
        admin_id, admin_email, action, target_type, target_id, details, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        adminId,
        adminEmail,
        action,
        targetType,
        targetId ? String(targetId) : null,
        details ? JSON.stringify(details) : null,
        ip,
      ]
    );
  } catch (err) {
    console.error('[ActivityLogger] Error recording admin action:', err.message);
  }
}
