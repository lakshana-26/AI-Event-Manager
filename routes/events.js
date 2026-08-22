const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const resourceAgent = require('../AGENTIC AI/resource_agent');
const reviewAgent = require('../AGENTIC AI/review_agent');
const tools = require('../AGENTIC AI/tools');
const logger = require('../utils/logger');

/**
 * Events Routes
 */

/**
 * GET /api/events
 * List all events with optional filters
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, organizerId, date } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (organizerId) filters.organizerId = organizerId;
    if (date) filters.date = date;

    const result = await resourceAgent.listEvents(filters);
    res.json(result);
  } catch (error) {
    logger.error('Error listing events', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/events
 * Create new event
 */
router.post('/', verifyToken, requireRole(['admin', 'organizer']), async (req, res) => {
  try {
    // Validate event data
    const validation = tools.validateEventData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event data',
        errors: validation.errors,
      });
    }

    const eventData = {
      ...req.body,
      organizerId: req.user.id,
    };

    const result = await resourceAgent.createEvent(eventData);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Error creating event', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/events/:id
 * Get event by ID
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await resourceAgent.getEvent(req.params.id);
    res.json(result);
  } catch (error) {
    logger.error('Error fetching event', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/events/:id
 * Update event
 */
router.put('/:id', verifyToken, requireRole(['admin', 'organizer']), async (req, res) => {
  try {
    const result = await resourceAgent.updateEvent(req.params.id, req.body);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Error updating event', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/events/:id
 * Delete event
 */
router.delete('/:id', verifyToken, requireRole(['admin', 'organizer']), async (req, res) => {
  try {
    const result = await resourceAgent.deleteEvent(req.params.id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Error deleting event', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/events/:id/review
 * Submit event for review
 */
router.post('/:id/review', verifyToken, requireRole(['admin', 'reviewer']), async (req, res) => {
  try {
    const result = await reviewAgent.reviewEvent(req.params.id);
    res.json(result);
  } catch (error) {
    logger.error('Error reviewing event', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/events/:id/reject
 * Reject event
 */
router.post('/:id/reject', verifyToken, requireRole(['admin', 'reviewer']), async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const result = await reviewAgent.rejectEvent(req.params.id, reason);
    res.json(result);
  } catch (error) {
    logger.error('Error rejecting event', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/events/:id/reviews
 * Get review history for event
 */
router.get('/:id/reviews', verifyToken, async (req, res) => {
  try {
    const result = await reviewAgent.getReviewHistory(req.params.id);
    res.json(result);
  } catch (error) {
    logger.error('Error fetching review history', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/events/pending/reviews
 * Get all pending reviews
 */
router.get('/pending/reviews', verifyToken, requireRole(['admin', 'reviewer']), async (req, res) => {
  try {
    const result = await reviewAgent.getPendingReviews();
    res.json(result);
  } catch (error) {
    logger.error('Error fetching pending reviews', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/events/:id/allocate-resource
 * Allocate resource to event
 */
router.post('/:id/allocate-resource', verifyToken, requireRole(['admin', 'organizer']), async (req, res) => {
  try {
    const { resourceId, quantity } = req.body;

    if (!resourceId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Resource ID and quantity are required',
      });
    }

    const result = await resourceAgent.allocateResource({
      eventId: req.params.id,
      resourceId,
      quantity,
    });

    res.json(result);
  } catch (error) {
    logger.error('Error allocating resource', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
