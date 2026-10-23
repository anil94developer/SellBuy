const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sellbuyer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

async function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool(dbConfig);
      // test ping
      const conn = await pool.getConnection();
      console.log(`[DB] Connected successfully to MySQL database "${dbConfig.database}" on port ${dbConfig.port}`);
      conn.release();
    } catch (err) {
      console.error(`[DB ERROR] Failed to connect to MySQL database "${dbConfig.database}":`, err.message);
      throw err;
    }
  }
  return pool;
}

async function query(sql, params = []) {
  const p = await getPool();
  const [results] = await p.query(sql, params);
  return results;
}

module.exports = {
  getPool,
  query,
  dbConfig
};
