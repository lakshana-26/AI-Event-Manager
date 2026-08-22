require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  dataPath: process.env.DATA_PATH || './UI',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  llmApiKey: process.env.LLM_API_KEY,
  llmModel: process.env.LLM_MODEL || 'gpt-3.5-turbo',
  llmProvider: process.env.LLM_PROVIDER || 'openai',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'info',
  enableWebSocket: process.env.ENABLE_WEBSOCKET === 'true',
  enableRag: process.env.ENABLE_RAG === 'true',
  enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
};
