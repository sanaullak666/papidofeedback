import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ExcelJS from 'exceljs';
import { query } from '../db/connection.js';
import { config } from '../config/index.js';
import { logAdminActivity } from '../utils/activityLogger.js';

/**
 * Admin Login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/username and password.',
      });
    }

    const trimmedIdentifier = email.trim();
    const users = await query(
      `SELECT id, username, email, password_hash, name, role 
       FROM admin_users 
       WHERE email = ? OR username = ? 
       LIMIT 1;`,
      [trimmedIdentifier, trimmedIdentifier]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your login details.',
      });
    }

    const admin = users[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your login details.',
      });
    }

    // Update last login timestamp
    await query('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?;', [admin.id]);

    const token = jwt.sign(
      {
        userId: admin.id,
        email: admin.email,
        role: admin.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    await logAdminActivity({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'LOGIN',
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    return res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('[AdminController] login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication error.',
    });
  }
}

/**
 * Get current authenticated user
 */
export async function getMe(req, res) {
  return res.json({
    success: true,
    user: req.user,
  });
}

/**
 * Dashboard Overview & Analytics
 */
export async function getDashboardAnalytics(req, res) {
  try {
    // 1. High-level aggregates
    const [stats] = await query(`
      SELECT 
        COUNT(*) AS total_responses,
        COALESCE(AVG(whatsapp_satisfaction), 0) AS avg_whatsapp_satisfaction,
        
        -- Booking preference percentages
        SUM(CASE WHEN preferred_booking_method = 'Papido Website' THEN 1 ELSE 0 END) AS prefer_website_count,
        SUM(CASE WHEN preferred_booking_method = 'WhatsApp' THEN 1 ELSE 0 END) AS prefer_whatsapp_count,
        SUM(CASE WHEN preferred_booking_method = 'Both' THEN 1 ELSE 0 END) AS prefer_both_count,
        SUM(CASE WHEN preferred_booking_method = 'No preference' THEN 1 ELSE 0 END) AS prefer_none_count,
        
        -- Website Adoption Intent
        SUM(CASE WHEN website_adoption_intent IN ('Definitely Yes', 'Probably Yes') THEN 1 ELSE 0 END) AS adoption_positive_count,
        
        -- Website Opinion High
        SUM(CASE WHEN website_opinion IN ('Excellent', 'Very Good') THEN 1 ELSE 0 END) AS opinion_positive_count,
        
        -- Launch support (Either alongside or move primarily)
        SUM(CASE WHEN launch_recommendation IN ('Launch alongside WhatsApp', 'Move primarily to website') THEN 1 ELSE 0 END) AS launch_support_count,
        
        -- Explored website
        SUM(CASE WHEN explored_website = 1 THEN 1 ELSE 0 END) AS explored_website_count,
        
        -- Willing to contact
        SUM(CASE WHEN willing_to_contact = 1 THEN 1 ELSE 0 END) AS willing_contact_count
      FROM survey_responses;
    `);

    const total = stats.total_responses || 0;
    const calcPct = (count) => (total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0);

    const metrics = {
      totalResponses: total,
      avgWhatsappSatisfaction: Number(Number(stats.avg_whatsapp_satisfaction || 0).toFixed(2)),
      websitePositiveRatingPct: calcPct(stats.opinion_positive_count),
      websiteAdoptionIntentPct: calcPct(stats.adoption_positive_count),
      preferWebsitePct: calcPct(stats.prefer_website_count),
      preferWhatsAppPct: calcPct(stats.prefer_whatsapp_count),
      preferBothPct: calcPct(stats.prefer_both_count),
      preferNonePct: calcPct(stats.prefer_none_count),
      launchSupportPct: calcPct(stats.launch_support_count),
      exploredWebsitePct: calcPct(stats.explored_website_count),
      willingContactCount: stats.willing_contact_count || 0,
    };

    // 2. Booking Preference Distribution
    const bookingPreferenceRows = await query(`
      SELECT preferred_booking_method AS method, COUNT(*) AS count
      FROM survey_responses
      GROUP BY preferred_booking_method
      ORDER BY count DESC;
    `);

    // 3. WhatsApp Satisfaction Distribution (1 to 5)
    const satisfactionRows = await query(`
      SELECT whatsapp_satisfaction AS rating, COUNT(*) AS count
      FROM survey_responses
      GROUP BY whatsapp_satisfaction
      ORDER BY rating ASC;
    `);

    // Ensure all 1..5 numbers exist in the map
    const satDist = [1, 2, 3, 4, 5].map((score) => {
      const found = satisfactionRows.find((r) => Number(r.rating) === score);
      return { rating: `${score} Star${score > 1 ? 's' : ''}`, score, count: found ? found.count : 0 };
    });

    // 4. Website Opinion Distribution
    const opinionRows = await query(`
      SELECT website_opinion AS opinion, COUNT(*) AS count
      FROM survey_responses
      GROUP BY website_opinion
      ORDER BY count DESC;
    `);

    // 5. Website Adoption Intent
    const adoptionRows = await query(`
      SELECT website_adoption_intent AS intent, COUNT(*) AS count
      FROM survey_responses
      GROUP BY website_adoption_intent
      ORDER BY count DESC;
    `);

    // 6. WhatsApp Continuation
    const continueWhatsAppRows = await query(`
      SELECT continue_whatsapp AS option_name, COUNT(*) AS count
      FROM survey_responses
      GROUP BY continue_whatsapp
      ORDER BY count DESC;
    `);

    // 7. Launch Recommendation Distribution
    const launchRecommendationRows = await query(`
      SELECT launch_recommendation AS recommendation, COUNT(*) AS count
      FROM survey_responses
      GROUP BY launch_recommendation
      ORDER BY count DESC;
    `);

    // 8. Ranked Requested Features (unpack from JSON)
    const featuresRawRows = await query(`
      SELECT requested_features FROM survey_responses WHERE requested_features IS NOT NULL;
    `);
    const featureCounts = {};
    featuresRawRows.forEach((r) => {
      let list = [];
      try {
        list = typeof r.requested_features === 'string' ? JSON.parse(r.requested_features) : r.requested_features;
      } catch (e) {
        list = [];
      }
      if (Array.isArray(list)) {
        list.forEach((item) => {
          if (item) {
            featureCounts[item] = (featureCounts[item] || 0) + 1;
          }
        });
      }
    });

    const rankedFeatures = Object.keys(featureCounts)
      .map((feature) => ({
        feature,
        count: featureCounts[feature],
        percentage: calcPct(featureCounts[feature]),
      }))
      .sort((a, b) => b.count - a.count);

    // 9. Feedback Trends by Date (last 14 days)
    const trendsRows = await query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date_label, COUNT(*) AS count
      FROM survey_responses
      WHERE created_at >= NOW() - INTERVAL 14 DAY
      GROUP BY date_label
      ORDER BY date_label ASC;
    `);

    // 10. Recent Feedback entries
    const recentResponses = await query(`
      SELECT 
        id, feedback_ref, created_at, whatsapp_satisfaction, website_opinion,
        preferred_booking_method, website_adoption_intent, launch_recommendation,
        willing_to_contact, contact_name, status
      FROM survey_responses
      ORDER BY created_at DESC
      LIMIT 8;
    `);

    return res.json({
      success: true,
      metrics,
      charts: {
        bookingPreference: bookingPreferenceRows,
        whatsappSatisfaction: satDist,
        websiteOpinion: opinionRows,
        websiteAdoption: adoptionRows,
        continueWhatsApp: continueWhatsAppRows,
        launchRecommendation: launchRecommendationRows,
        rankedFeatures,
        trends: trendsRows,
      },
      recentResponses,
    });
  } catch (err) {
    console.error('[AdminController] getDashboardAnalytics error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard analytics.',
    });
  }
}

/**
 * Filterable & Paginated Feedback List
 */
export async function getFeedbackList(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      preferred_booking_method = '',
      whatsapp_satisfaction = '',
      website_opinion = '',
      website_adoption_intent = '',
      launch_recommendation = '',
      date_from = '',
      date_to = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const whereClauses = [];
    const queryParams = [];

    // Search query
    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      whereClauses.push(`(
        feedback_ref LIKE ? OR 
        contact_name LIKE ? OR 
        contact_mobile LIKE ? OR 
        contact_email LIKE ? OR 
        most_important_improvement LIKE ? OR 
        additional_feedback LIKE ? OR 
        website_improvements LIKE ?
      )`);
      queryParams.push(term, term, term, term, term, term, term);
    }

    // Status filter
    if (status && status !== 'All') {
      whereClauses.push('status = ?');
      queryParams.push(status);
    }

    // Preferred booking method
    if (preferred_booking_method && preferred_booking_method !== 'All') {
      whereClauses.push('preferred_booking_method = ?');
      queryParams.push(preferred_booking_method);
    }

    // WhatsApp satisfaction
    if (whatsapp_satisfaction && whatsapp_satisfaction !== 'All') {
      whereClauses.push('whatsapp_satisfaction = ?');
      queryParams.push(parseInt(whatsapp_satisfaction, 10));
    }

    // Website opinion
    if (website_opinion && website_opinion !== 'All') {
      whereClauses.push('website_opinion = ?');
      queryParams.push(website_opinion);
    }

    // Website adoption intent
    if (website_adoption_intent && website_adoption_intent !== 'All') {
      whereClauses.push('website_adoption_intent = ?');
      queryParams.push(website_adoption_intent);
    }

    // Launch recommendation
    if (launch_recommendation && launch_recommendation !== 'All') {
      whereClauses.push('launch_recommendation = ?');
      queryParams.push(launch_recommendation);
    }

    // Date range
    if (date_from) {
      whereClauses.push('created_at >= ?');
      queryParams.push(`${date_from} 00:00:00`);
    }
    if (date_to) {
      whereClauses.push('created_at <= ?');
      queryParams.push(`${date_to} 23:59:59`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count total matching
    const countQuery = `SELECT COUNT(*) AS total FROM survey_responses ${whereSql};`;
    const [countResult] = await query(countQuery, queryParams);
    const total = countResult.total || 0;

    // Allowed sort columns
    const allowedSortColumns = [
      'created_at',
      'whatsapp_satisfaction',
      'website_opinion',
      'preferred_booking_method',
      'website_adoption_intent',
      'status',
      'feedback_ref',
    ];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Fetch records
    const dataQuery = `
      SELECT 
        id, feedback_ref, created_at, whatsapp_satisfaction, website_opinion,
        website_ease_of_use, preferred_booking_method, website_adoption_intent,
        continue_whatsapp, both_convenience, launch_recommendation,
        willing_to_contact, contact_name, contact_mobile, contact_email,
        status, admin_notes, most_important_improvement, additional_feedback
      FROM survey_responses
      ${whereSql}
      ORDER BY ${safeSortBy} ${safeOrder}
      LIMIT ? OFFSET ?;
    `;

    const records = await query(dataQuery, [...queryParams, limitNum, offset]);

    return res.json({
      success: true,
      data: records,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    console.error('[AdminController] getFeedbackList error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve survey feedback.',
    });
  }
}

/**
 * Get single feedback response by ID
 */
export async function getFeedbackById(req, res) {
  try {
    const { id } = req.params;
    const records = await query('SELECT * FROM survey_responses WHERE id = ? LIMIT 1;', [id]);

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback submission not found.',
      });
    }

    const item = records[0];
    // Safely parse JSON fields
    ['whatsapp_likes', 'whatsapp_difficulties', 'website_likes', 'requested_features'].forEach((field) => {
      if (typeof item[field] === 'string') {
        try {
          item[field] = JSON.parse(item[field]);
        } catch (e) {
          item[field] = [];
        }
      }
    });

    return res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    console.error('[AdminController] getFeedbackById error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedback record.',
    });
  }
}

/**
 * Update feedback status & admin notes
 */
export async function updateFeedbackStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const validStatuses = ['New', 'Reviewed', 'Important', 'Archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be New, Reviewed, Important, or Archived.',
      });
    }

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(admin_notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update parameters provided.',
      });
    }

    params.push(id);
    await query(`UPDATE survey_responses SET ${updates.join(', ')} WHERE id = ?;`, params);

    await logAdminActivity({
      adminId: req.user.id,
      adminEmail: req.user.email,
      action: 'UPDATE_STATUS',
      targetType: 'FEEDBACK',
      targetId: id,
      details: { status, admin_notes },
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    return res.json({
      success: true,
      message: 'Feedback updated successfully.',
    });
  } catch (err) {
    console.error('[AdminController] updateFeedbackStatus error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update feedback.',
    });
  }
}

/**
 * Delete feedback response
 */
export async function deleteFeedback(req, res) {
  try {
    const { id } = req.params;

    const records = await query('SELECT feedback_ref FROM survey_responses WHERE id = ? LIMIT 1;', [id]);
    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback submission not found.',
      });
    }

    const ref = records[0].feedback_ref;
    await query('DELETE FROM survey_responses WHERE id = ?;', [id]);

    await logAdminActivity({
      adminId: req.user.id,
      adminEmail: req.user.email,
      action: 'DELETE_FEEDBACK',
      targetType: 'FEEDBACK',
      targetId: id,
      details: { feedback_ref: ref },
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    return res.json({
      success: true,
      message: `Feedback ${ref} deleted successfully.`,
    });
  } catch (err) {
    console.error('[AdminController] deleteFeedback error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete feedback entry.',
    });
  }
}

/**
 * Export responses as CSV
 */
export async function exportCsv(req, res) {
  try {
    const responses = await query(`
      SELECT 
        feedback_ref, created_at, status,
        whatsapp_satisfaction, whatsapp_likes, whatsapp_likes_other,
        whatsapp_difficulties, whatsapp_difficulties_other,
        explored_website, website_opinion, website_ease_of_use,
        website_likes, website_likes_other, website_improvements,
        preferred_booking_method, website_adoption_intent,
        continue_whatsapp, both_convenience,
        requested_features, requested_features_other,
        most_important_improvement, launch_recommendation,
        additional_feedback, willing_to_contact,
        contact_name, contact_mobile, contact_email, admin_notes
      FROM survey_responses
      ORDER BY created_at DESC;
    `);

    // Helper to format CSV cells
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Feedback ID',
      'Submission Date',
      'Status',
      'WhatsApp Satisfaction (1-5)',
      'WhatsApp Likes',
      'WhatsApp Likes (Other)',
      'WhatsApp Difficulties',
      'WhatsApp Difficulties (Other)',
      'Explored Website',
      'Website Overall Opinion',
      'Website Ease of Use',
      'Website Likes',
      'Website Likes (Other)',
      'Website Improvements Needed',
      'Preferred Booking Method',
      'Would Use Website If Launched',
      'Should Continue WhatsApp',
      'Would Having Both Be More Convenient',
      'Requested Features',
      'Requested Features (Other)',
      'Most Important Improvement',
      'What Should Papido Do (Launch Recommendation)',
      'Additional Feedback',
      'Willing to Be Contacted',
      'Contact Name',
      'Contact Mobile',
      'Contact Email',
      'Admin Notes',
    ];

    let csvContent = headers.map(escapeCsv).join(',') + '\r\n';

    responses.forEach((r) => {
      const row = [
        r.feedback_ref,
        r.created_at,
        r.status,
        r.whatsapp_satisfaction,
        r.whatsapp_likes,
        r.whatsapp_likes_other,
        r.whatsapp_difficulties,
        r.whatsapp_difficulties_other,
        r.explored_website ? 'Yes' : 'No',
        r.website_opinion,
        r.website_ease_of_use,
        r.website_likes,
        r.website_likes_other,
        r.website_improvements,
        r.preferred_booking_method,
        r.website_adoption_intent,
        r.continue_whatsapp,
        r.both_convenience,
        r.requested_features,
        r.requested_features_other,
        r.most_important_improvement,
        r.launch_recommendation,
        r.additional_feedback,
        r.willing_to_contact ? 'Yes' : 'No',
        r.contact_name,
        r.contact_mobile,
        r.contact_email,
        r.admin_notes,
      ];
      csvContent += row.map(escapeCsv).join(',') + '\r\n';
    });

    await logAdminActivity({
      adminId: req.user.id,
      adminEmail: req.user.email,
      action: 'EXPORT_CSV',
      details: { rowCount: responses.length },
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    const filename = `papido_survey_responses_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('[AdminController] exportCsv error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate CSV export.',
    });
  }
}

/**
 * Export responses as formatted Excel (.xlsx)
 */
export async function exportExcel(req, res) {
  try {
    const responses = await query(`
      SELECT 
        feedback_ref, created_at, status,
        whatsapp_satisfaction, whatsapp_likes, whatsapp_likes_other,
        whatsapp_difficulties, whatsapp_difficulties_other,
        explored_website, website_opinion, website_ease_of_use,
        website_likes, website_likes_other, website_improvements,
        preferred_booking_method, website_adoption_intent,
        continue_whatsapp, both_convenience,
        requested_features, requested_features_other,
        most_important_improvement, launch_recommendation,
        additional_feedback, willing_to_contact,
        contact_name, contact_mobile, contact_email, admin_notes
      FROM survey_responses
      ORDER BY created_at DESC;
    `);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Papido Technologies';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Survey Responses');

    // Define columns
    worksheet.columns = [
      { header: 'Feedback ID', key: 'feedback_ref', width: 16 },
      { header: 'Date', key: 'created_at', width: 20 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'WhatsApp Satisfaction (1-5)', key: 'whatsapp_satisfaction', width: 18 },
      { header: 'WhatsApp Likes', key: 'whatsapp_likes', width: 28 },
      { header: 'WhatsApp Difficulties', key: 'whatsapp_difficulties', width: 30 },
      { header: 'Explored Website', key: 'explored_website', width: 15 },
      { header: 'Website Opinion', key: 'website_opinion', width: 16 },
      { header: 'Ease of Use', key: 'website_ease_of_use', width: 16 },
      { header: 'Website Likes', key: 'website_likes', width: 26 },
      { header: 'Website Improvements', key: 'website_improvements', width: 32 },
      { header: 'Preferred Method', key: 'preferred_booking_method', width: 20 },
      { header: 'Would Use Website', key: 'website_adoption_intent', width: 20 },
      { header: 'Continue WhatsApp', key: 'continue_whatsapp', width: 22 },
      { header: 'Both More Convenient', key: 'both_convenience', width: 20 },
      { header: 'Requested Features', key: 'requested_features', width: 32 },
      { header: 'Most Important Improvement', key: 'most_important_improvement', width: 35 },
      { header: 'Launch Recommendation', key: 'launch_recommendation', width: 30 },
      { header: 'Additional Feedback', key: 'additional_feedback', width: 35 },
      { header: 'Willing to Contact', key: 'willing_to_contact', width: 16 },
      { header: 'Contact Name', key: 'contact_name', width: 20 },
      { header: 'Contact Mobile', key: 'contact_mobile', width: 18 },
      { header: 'Contact Email', key: 'contact_email', width: 26 },
      { header: 'Admin Notes', key: 'admin_notes', width: 26 },
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD97706' }, // Papido Amber
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 28;

    // Add rows
    responses.forEach((r) => {
      const formatArray = (val) => {
        if (!val) return '';
        try {
          const parsed = typeof val === 'string' ? JSON.parse(val) : val;
          return Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
        } catch (e) {
          return String(val);
        }
      };

      worksheet.addRow({
        feedback_ref: r.feedback_ref,
        created_at: r.created_at,
        status: r.status,
        whatsapp_satisfaction: r.whatsapp_satisfaction,
        whatsapp_likes: formatArray(r.whatsapp_likes),
        whatsapp_difficulties: formatArray(r.whatsapp_difficulties),
        explored_website: r.explored_website ? 'Yes' : 'No',
        website_opinion: r.website_opinion,
        website_ease_of_use: r.website_ease_of_use,
        website_likes: formatArray(r.website_likes),
        website_improvements: r.website_improvements || '',
        preferred_booking_method: r.preferred_booking_method,
        website_adoption_intent: r.website_adoption_intent,
        continue_whatsapp: r.continue_whatsapp,
        both_convenience: r.both_convenience,
        requested_features: formatArray(r.requested_features),
        most_important_improvement: r.most_important_improvement || '',
        launch_recommendation: r.launch_recommendation,
        additional_feedback: r.additional_feedback || '',
        willing_to_contact: r.willing_to_contact ? 'Yes' : 'No',
        contact_name: r.contact_name || '',
        contact_mobile: r.contact_mobile || '',
        contact_email: r.contact_email || '',
        admin_notes: r.admin_notes || '',
      });
    });

    await logAdminActivity({
      adminId: req.user.id,
      adminEmail: req.user.email,
      action: 'EXPORT_EXCEL',
      details: { rowCount: responses.length },
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    const filename = `papido_survey_responses_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (err) {
    console.error('[AdminController] exportExcel error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Excel export.',
    });
  }
}

/**
 * Get recent activity logs
 */
export async function getActivityLogs(req, res) {
  try {
    const logs = await query(`
      SELECT id, admin_email, action, target_type, target_id, details, ip_address, created_at
      FROM admin_activity_logs
      ORDER BY created_at DESC
      LIMIT 50;
    `);

    return res.json({
      success: true,
      logs,
    });
  } catch (err) {
    console.error('[AdminController] getActivityLogs error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve activity logs.',
    });
  }
}

/**
 * Update app settings
 */
export async function updateSettings(req, res) {
  try {
    const { new_booking_website_url, survey_active } = req.body;

    if (new_booking_website_url !== undefined) {
      await query(
        `INSERT INTO app_settings (setting_key, setting_value, description)
         VALUES ('new_booking_website_url', ?, 'Public link to the new Papido booking website preview')
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);`,
        [new_booking_website_url]
      );
    }

    if (survey_active !== undefined) {
      await query(
        `INSERT INTO app_settings (setting_key, setting_value, description)
         VALUES ('survey_active', ?, 'Master switch to accept public survey submissions')
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);`,
        [String(survey_active)]
      );
    }

    await logAdminActivity({
      adminId: req.user.id,
      adminEmail: req.user.email,
      action: 'UPDATE_SETTINGS',
      details: req.body,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    return res.json({
      success: true,
      message: 'Settings updated successfully.',
    });
  } catch (err) {
    console.error('[AdminController] updateSettings error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update settings.',
    });
  }
}
