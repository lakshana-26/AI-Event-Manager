const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const resourceAgent = require('../AGENTIC AI/resource_agent');
const logger = require('../utils/logger');

/**
 * Resources Routes
 */

/**
 * GET /api/resources
 * List all resources
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, available } = req.query;
    const filters = {};

    if (type) filters.type = type;
    if (available !== undefined) filters.available = available === 'true';

    const result = await resourceAgent.listResources(filters);
    res.json(result);
  } catch (error) {
    logger.error('Error listing resources', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/resources/venues
 * List all venues
 */
router.get('/venues', verifyToken, async (req, res) => {
  try {
    const { capacity, availability } = req.query;
    const filters = {};

    if (capacity) filters.capacity = parseInt(capacity);
    if (availability) filters.availability = availability;

    const result = await resourceAgent.listVenues(filters);
    res.json(result);
  } catch (error) {
    logger.error('Error listing venues', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/resources/venues/:id
 * Get venue details
 */
router.get('/venues/:id', verifyToken, async (req, res) => {
  try {
    // Load venues from data
    const dataLoader = require('../utils/dataLoader');
    const venues = dataLoader.loadJSON('venues');
    const venue = venues.find(v => v.id === req.params.id || v.id === parseInt(req.params.id));

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    res.json({ success: true, venue });
  } catch (error) {
    logger.error('Error fetching venue', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/resources/check-availability
 * Check resource/venue availability for a date range
 */
router.get('/check-availability', verifyToken, async (req, res) => {
  try {
    const { resourceId, startDate, endDate } = req.query;

    if (!resourceId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Resource ID, start date, and end date are required',
      });
    }

    // Load events to check for conflicts
    const dataLoader = require('../utils/dataLoader');
    const events = dataLoader.loadJSON('events');

    const conflicts = events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const queryStart = new Date(startDate);
      const queryEnd = new Date(endDate);

      // Check for date overlap
      return (
        event.allocatedResources?.some(r => r.resourceId === resourceId) &&
        eventStart < queryEnd &&
        eventEnd > queryStart
      );
    });

    const isAvailable = conflicts.length === 0;

    res.json({
      success: true,
      resourceId,
      isAvailable,
      conflicts: isAvailable ? [] : conflicts.map(e => ({ id: e.id, name: e.name })),
    });
  } catch (error) {
    logger.error('Error checking availability', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
