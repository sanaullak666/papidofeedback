import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env from root or server directory
if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else if (fs.existsSync('server/.env')) {
  dotenv.config({ path: 'server/.env' });
} else if (fs.existsSync('../server/.env')) {
  dotenv.config({ path: '../server/.env' });
} else {
  dotenv.config();
}

function parseDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl);
      const isSsl = parsed.searchParams.has('ssl') || parsed.port === '4000' || process.env.DB_SSL === 'true';
      return {
        host: parsed.hostname,
        port: parseInt(parsed.port || '3306', 10),
        user: decodeURIComponent(parsed.username || 'root'),
        password: decodeURIComponent(parsed.password || ''),
        database: (parsed.pathname || '/papido_survey_db').replace(/^\//, '') || 'papido_survey_db',
        ssl: isSsl,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
      };
    } catch (e) {
      console.warn('[Config] Failed to parse DATABASE_URL, falling back to individual variables.');
    }
  }

  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const isSsl = process.env.DB_SSL === 'true' || port === 4000;

  return {
    host: process.env.DB_HOST || '127.0.0.1',
    port,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'papido_survey_db',
    ssl: isSsl,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  };
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  db: parseDatabaseConfig(),

  jwt: {
    secret: process.env.JWT_SECRET || 'papido_survey_secret_default_key_change_me_in_prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  rateLimit: {
    windowMs: parseInt(process.env.SUBMIT_RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.SUBMIT_RATE_LIMIT_MAX || '20', 10),
  },

  adminDefault: {
    email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@papido.online',
    password: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Papido2026!',
    name: process.env.ADMIN_DEFAULT_NAME || 'Papido Administrator',
  },

  newBookingWebsiteUrl: process.env.NEW_BOOKING_WEBSITE_URL || 'https://www.papido.online',
};
