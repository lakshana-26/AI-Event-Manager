const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const config = require('./config');
const logger = require('./utils/logger');

// Import agents
const mainAgent = require('./AGENTIC AI/main_agent');
const peopleAgent = require('./AGENTIC AI/people_agent');
const resourceAgent = require('./AGENTIC AI/resource_agent');
const reviewAgent = require('./AGENTIC AI/review_agent');
const ragService = require('./AGENTIC AI/rag');
const tools = require('./AGENTIC AI/tools');
const stateManager = require('./AGENTIC AI/memory/state');

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');
const ragRoutes = require('./routes/rag');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO for real-time features
const io = socketIo(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { query: req.query, body: req.body });
  next();
});

// Register agents with main agent
mainAgent.registerAgent('peopleAgent', peopleAgent);
mainAgent.registerAgent('resourceAgent', resourceAgent);
mainAgent.registerAgent('reviewAgent', reviewAgent);

// Initialize RAG service
if (config.enableRag) {
  ragService.initializeKnowledgeBase();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    agents: mainAgent.getStatus(),
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    version: '1.0.0',
    nodeEnv: config.nodeEnv,
    agents: mainAgent.getStatus(),
    features: {
      websocket: config.enableWebSocket,
      rag: config.enableRag,
      notifications: config.enableNotifications,
    },
  });
});

// System info endpoint
app.get('/api/system/info', (req, res) => {
  res.json({
    mainAgent: mainAgent.getInfo?.() || {},
    peopleAgent: peopleAgent.getInfo(),
    resourceAgent: resourceAgent.getInfo(),
    reviewAgent: reviewAgent.getInfo(),
    stateSize: stateManager.getStateSize(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/rag', ragRoutes);

// Direct agent routing endpoint
app.post('/api/agents/route', async (req, res) => {
  try {
    const { type, payload } = req.body;
    const result = await mainAgent.routeRequest(type, payload);
    res.json(result);
  } catch (error) {
    logger.error('Error in agent routing', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all data endpoint
app.get('/api/data/all', async (req, res) => {
  try {
    const data = await mainAgent.getAllData();
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching all data', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// WebSocket setup for real-time features
if (config.enableWebSocket) {
  io.on('connection', (socket) => {
    logger.info('WebSocket client connected', { socketId: socket.id });

    // Listen for event updates
    socket.on('event:update', async (data) => {
      const result = await resourceAgent.updateEvent(data.id, data.changes);
      socket.emit('event:updated', result);
      io.emit('event:changed', result); // Broadcast to all clients
    });

    // Listen for agent requests
    socket.on('agent:request', async (data) => {
      const result = await mainAgent.routeRequest(data.type, data.payload);
      socket.emit('agent:response', result);
    });

    socket.on('disconnect', () => {
      logger.info('WebSocket client disconnected', { socketId: socket.id });
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`AI Event Manager Backend started on port ${PORT}`, {
    environment: config.nodeEnv,
    corsOrigin: config.corsOrigin,
    ragEnabled: config.enableRag,
    websocketEnabled: config.enableWebSocket,
  });

  console.log(`
    ╔════════════════════════════════════════╗
    ║  AI Event Manager Backend              ║
    ║  Server running on port ${PORT}        ║
    ║  Environment: ${config.nodeEnv.toUpperCase().padEnd(24)}║
    ╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };
