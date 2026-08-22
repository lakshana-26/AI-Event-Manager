const fs = require('fs');
const path = require('path');
const config = require('../config');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = {
  info: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}`;
    console.log(logMessage, data);
    fs.appendFileSync(config.logLevel !== 'debug' ? path.join(logsDir, 'app.log') : '', `${logMessage} ${JSON.stringify(data)}\n`);
  },

  error: (message, error = {}) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}`;
    console.error(logMessage, error);
    fs.appendFileSync(path.join(logsDir, 'error.log'), `${logMessage} ${JSON.stringify(error)}\n`);
  },

  warn: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}`;
    console.warn(logMessage, data);
  },

  debug: (message, data = {}) => {
    if (config.logLevel === 'debug') {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] DEBUG: ${message}`;
      console.log(logMessage, data);
    }
  },
};

module.exports = logger;
