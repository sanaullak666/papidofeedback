import { ensureDatabaseExists, query } from './connection.js';

export async function runMigrations() {
  console.log('[Migration] Starting database migrations...');
  await ensureDatabaseExists();

  // 1. Admin Users Table
  await query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(120) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME NULL,
      INDEX idx_admin_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('[Migration] Table `admin_users` ready.');

  // 2. Survey Responses Table
  await query(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      feedback_ref VARCHAR(40) NOT NULL UNIQUE,
      current_booking_method VARCHAR(60) DEFAULT 'WhatsApp',
      
      -- Step 1: WhatsApp Booking
      whatsapp_satisfaction INT NOT NULL,
      whatsapp_likes JSON NULL,
      whatsapp_likes_other VARCHAR(255) NULL,
      whatsapp_difficulties JSON NULL,
      whatsapp_difficulties_other VARCHAR(255) NULL,
      
      -- Step 2 & 3: Website Exploration & Opinion
      explored_website BOOLEAN DEFAULT FALSE,
      website_opinion VARCHAR(60) NOT NULL,
      website_ease_of_use VARCHAR(60) NOT NULL,
      website_likes JSON NULL,
      website_likes_other VARCHAR(255) NULL,
      website_improvements TEXT NULL,
      
      -- Step 4: WhatsApp vs Website
      preferred_booking_method VARCHAR(60) NOT NULL,
      website_adoption_intent VARCHAR(60) NOT NULL,
      continue_whatsapp VARCHAR(60) NOT NULL,
      both_convenience VARCHAR(60) NOT NULL,
      
      -- Step 5: Features & Key Recommendation
      requested_features JSON NULL,
      requested_features_other VARCHAR(255) NULL,
      most_important_improvement TEXT NULL,
      launch_recommendation VARCHAR(120) NOT NULL,
      
      -- Final feedback & optional contact
      additional_feedback TEXT NULL,
      willing_to_contact BOOLEAN DEFAULT FALSE,
      contact_name VARCHAR(120) NULL,
      contact_mobile VARCHAR(30) NULL,
      contact_email VARCHAR(255) NULL,
      
      -- Administrative metadata
      status ENUM('New', 'Reviewed', 'Important', 'Archived') DEFAULT 'New',
      admin_notes TEXT NULL,
      ip_address VARCHAR(45) NULL,
      user_agent VARCHAR(500) NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      -- Optimized query indexes
      INDEX idx_ref (feedback_ref),
      INDEX idx_created_at (created_at),
      INDEX idx_status (status),
      INDEX idx_pref_method (preferred_booking_method),
      INDEX idx_wa_sat (whatsapp_satisfaction),
      INDEX idx_web_opinion (website_opinion),
      INDEX idx_adoption (website_adoption_intent),
      INDEX idx_launch_rec (launch_recommendation)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('[Migration] Table `survey_responses` ready.');

  // 3. Admin Activity Logs Table
  await query(`
    CREATE TABLE IF NOT EXISTS admin_activity_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      admin_id INT NULL,
      admin_email VARCHAR(255) NULL,
      action VARCHAR(100) NOT NULL,
      target_type VARCHAR(60) NULL,
      target_id VARCHAR(60) NULL,
      details JSON NULL,
      ip_address VARCHAR(45) NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_log_created_at (created_at),
      INDEX idx_log_action (action)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('[Migration] Table `admin_activity_logs` ready.');

  // 4. App Settings Table
  await query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT NOT NULL,
      description VARCHAR(255) NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('[Migration] Table `app_settings` ready.');

  console.log('[Migration] All database tables successfully migrated.');
}

// Allow direct execution via CLI
if (process.argv[1]?.endsWith('migrate.js')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Migration] Failed:', err);
      process.exit(1);
    });
}
