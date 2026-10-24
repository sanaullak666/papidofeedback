import mysql from 'mysql2/promise';
import { config } from '../config/index.js';

let pool = null;

/**
 * Ensures the target database exists on the MySQL server
 */
export async function ensureDatabaseExists() {
  try {
    const adminConnection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      ssl: config.db.ssl ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
    });

    await adminConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );

    await adminConnection.end();
    console.log(`[Database] Database '${config.db.database}' ensured.`);
  } catch (err) {
    console.error('[Database] Failed to ensure database exists:', err.message);
    throw err;
  }
}

/**
 * Initialize connection pool to the survey database
 */
export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      ssl: config.db.ssl ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
      waitForConnections: true,
      connectionLimit: config.db.connectionLimit,
      queueLimit: 0,
      charset: 'utf8mb4',
      dateStrings: true,
    });
  }
  return pool;
}

/**
 * Execute a parameterized query
 */
export async function query(sql, params = []) {
  const connectionPool = getPool();
  const [results] = await connectionPool.execute(sql, params);
  return results;
}

export default {
  getPool,
  query,
  ensureDatabaseExists,
};
