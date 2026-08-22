const express = require('express');
const router = express.Router();
const { verifyToken, generateToken, requireRole } = require('../middleware/auth');
const peopleAgent = require('../AGENTIC AI/people_agent');
const logger = require('../utils/logger');

/**
 * Auth Routes
 */

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await peopleAgent.authenticateUser({ email, password });

    if (!result.success) {
      return res.status(401).json(result);
    }

    const token = generateToken({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: result.user,
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required',
      });
    }

    const result = await peopleAgent.createUser({
      name,
      email,
      password, // In production, hash this!
      role,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    const token = generateToken({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    res.json({
      success: true,
      message: 'Registration successful',
      token,
      user: result.user,
    });
  } catch (error) {
    logger.error('Registration error', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/auth/verify
 * Verify JWT token
 */
router.get('/verify', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user,
  });
});

/**
 * GET /api/auth/profile
 * Get authenticated user profile
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await peopleAgent.getUser(req.user.id);
    res.json(result);
  } catch (error) {
    logger.error('Error fetching profile', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/auth/profile
 * Update authenticated user profile
 */
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const result = await peopleAgent.updateUser(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    logger.error('Error updating profile', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (frontend should discard token)
 */
router.post('/logout', verifyToken, (req, res) => {
  logger.info('User logout', { userId: req.user.id });
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

module.exports = router;
