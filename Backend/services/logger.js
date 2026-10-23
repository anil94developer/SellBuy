const fs = require('fs');
const path = require('path');
const { query } = require('../db/connection');

const LOGS_DIR = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const SYSTEM_LOG_FILE = path.join(LOGS_DIR, 'system.log');
const AUDIT_LOG_FILE = path.join(LOGS_DIR, 'audit.log');

// Circular buffer for instant real-time live log stream
const inMemoryLogs = [];
const MAX_MEMORY_LOGS = 250;

function appendToFile(filePath, text) {
  try {
    fs.appendFileSync(filePath, text + '\n', 'utf8');
  } catch (err) {
    console.error('[LOGGER FS ERROR]', err.message);
  }
}

async function recordLog({ level = 'INFO', module = 'SYSTEM', action = 'GENERAL', details = '', userId = null, userName = null, ip = '127.0.0.1' }) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    timestamp,
    level,
    module,
    action,
    details: typeof details === 'object' ? JSON.stringify(details) : String(details),
    userId,
    userName,
    ip
  };

  // Push to memory
  inMemoryLogs.unshift(logEntry);
  if (inMemoryLogs.length > MAX_MEMORY_LOGS) {
    inMemoryLogs.pop();
  }

  // Format line
  const formattedLine = `[${timestamp}] [${level}] [${module}:${action}] (User: ${userName || userId || 'Guest'}) ${logEntry.details}`;
  
  // Console output
  console.log(formattedLine);

  // File write
  appendToFile(SYSTEM_LOG_FILE, formattedLine);
  if (level === 'AUTH' || level === 'ADMIN' || level === 'CAR') {
    appendToFile(AUDIT_LOG_FILE, formattedLine);
  }

  // Async DB insert without blocking
  try {
    query(
      'INSERT INTO audit_logs (user_id, user_name, action, module, details, ip_address, level) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, userName, action, module, logEntry.details, ip, level]
    ).catch(err => {
      // quiet fail on log insert to avoid cascade
    });
  } catch (e) {
    // ignore
  }

  return logEntry;
}

const logger = {
  info: (module, action, details, ctx = {}) => recordLog({ level: 'INFO', module, action, details, ...ctx }),
  warn: (module, action, details, ctx = {}) => recordLog({ level: 'WARN', module, action, details, ...ctx }),
  error: (module, action, details, ctx = {}) => recordLog({ level: 'ERROR', module, action, details, ...ctx }),
  auth: (action, details, ctx = {}) => recordLog({ level: 'AUTH', module: 'AUTH', action, details, ...ctx }),
  car: (action, details, ctx = {}) => recordLog({ level: 'CAR', module: 'MARKETPLACE', action, details, ...ctx }),
  admin: (action, details, ctx = {}) => recordLog({ level: 'ADMIN', module: 'ADMIN', action, details, ...ctx }),
  getRecentLogs: () => inMemoryLogs
};

module.exports = logger;
