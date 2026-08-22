const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const ragService = require('../AGENTIC AI/rag');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * RAG Routes
 * Retrieval-Augmented Generation endpoints for enhanced data retrieval
 */

/**
 * POST /api/rag/search
 * Search across all data
 */
router.post('/search', verifyToken, (req, res) => {
  try {
    if (!config.enableRag) {
      return res.status(503).json({
        success: false,
        message: 'RAG service is not enabled',
      });
    }

    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required',
      });
    }

    const result = ragService.search(query);
    res.json(result);
  } catch (error) {
    logger.error('Error searching', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/rag/query
 * Generate response using LLM with RAG
 */
router.post('/query', verifyToken, async (req, res) => {
  try {
    if (!config.enableRag) {
      return res.status(503).json({
        success: false,
        message: 'RAG service is not enabled',
      });
    }

    const { query, category } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required',
      });
    }

    const context = ragService.retrieveContext(query, category);
    const result = await ragService.generateResponse(query, context);

    res.json(result);
  } catch (error) {
    logger.error('Error generating response', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/rag/suggestions/:eventId
 * Get AI suggestions for event improvements
 */
router.get('/suggestions/:eventId', verifyToken, async (req, res) => {
  try {
    if (!config.enableRag) {
      return res.status(503).json({
        success: false,
        message: 'RAG service is not enabled',
      });
    }

    const result = await ragService.suggestEventImprovements(req.params.eventId);
    res.json(result);
  } catch (error) {
    logger.error('Error getting suggestions', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/rag/knowledge-base
 * Get knowledge base status and statistics
 */
router.get('/knowledge-base', verifyToken, (req, res) => {
  try {
    if (!config.enableRag) {
      return res.status(503).json({
        success: false,
        message: 'RAG service is not enabled',
      });
    }

    const stats = {
      success: true,
      initialized: Object.keys(ragService.knowledgeBase).length > 0,
      categories: Object.keys(ragService.knowledgeBase),
      itemCount: Object.entries(ragService.knowledgeBase).reduce(
        (sum, [_, items]) => sum + (Array.isArray(items) ? items.length : 0),
        0
      ),
    };

    // Add count per category
    for (const [category, items] of Object.entries(ragService.knowledgeBase)) {
      stats[`${category}Count`] = Array.isArray(items) ? items.length : 0;
    }

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching knowledge base stats', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/rag/initialize
 * Re-initialize knowledge base
 */
router.post('/initialize', verifyToken, (req, res) => {
  try {
    if (!config.enableRag) {
      return res.status(503).json({
        success: false,
        message: 'RAG service is not enabled',
      });
    }

    ragService.initializeKnowledgeBase();
    res.json({
      success: true,
      message: 'Knowledge base re-initialized',
    });
  } catch (error) {
    logger.error('Error initializing knowledge base', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
