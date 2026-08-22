const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const peopleAgent = require('../AGENTIC AI/people_agent');
const logger = require('../utils/logger');

/**
 * Users Routes
 */

/**
 * GET /api/users
 * List all users (admin only)
 */
router.get('/', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role, status } = req.query;
    const filters = {};

    if (role) filters.role = role;
    if (status) filters.status = status;

    const result = await peopleAgent.listUsers(filters);
    res.json(result);
  } catch (error) {
    logger.error('Error listing users', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    // Users can only view their own profile unless they're admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this profile',
      });
    }

    const result = await peopleAgent.getUser(req.params.id);
    res.json(result);
  } catch (error) {
    logger.error('Error fetching user', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/users/:id
 * Update user (admin only or own profile)
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this profile',
      });
    }

    const result = await peopleAgent.updateUser(req.params.id, req.body);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Error updating user', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/users/staff/list
 * List all staff members
 */
router.get('/staff/list', verifyToken, async (req, res) => {
  try {
    const { department } = req.query;
    const filters = {};

    if (department) filters.department = department;

    const result = await peopleAgent.listStaff(filters);
    res.json(result);
  } catch (error) {
    logger.error('Error listing staff', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/users/students/list
 * List all students
 */
router.get('/students/list', verifyToken, async (req, res) => {
  try {
    const { year } = req.query;
    const filters = {};

    if (year) filters.year = year;

    const result = await peopleAgent.listStudents(filters);
    res.json(result);
  } catch (error) {
    logger.error('Error listing students', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
