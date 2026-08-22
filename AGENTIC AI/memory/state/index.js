const fs = require('fs');
const path = require('path');
const logger = require('../../../utils/logger');

/**
 * State Management for Agent Memory
 * Handles persistent and temporary state for agents
 */
class StateManager {
  constructor() {
    this.stateDir = path.join(__dirname, 'persistent');
    this.memoryCache = {};
    this.initializeStateDir();
  }

  /**
   * Initialize state directory
   */
  initializeStateDir() {
    if (!fs.existsSync(this.stateDir)) {
      fs.mkdirSync(this.stateDir, { recursive: true });
      logger.info('State directory initialized', { path: this.stateDir });
    }
  }

  /**
   * Save state to disk
   */
  saveState(key, value) {
    try {
      const filePath = path.join(this.stateDir, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
      this.memoryCache[key] = value;
      logger.info(`State saved: ${key}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error saving state: ${key}`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Load state from disk
   */
  loadState(key) {
    try {
      // Return cached state if available
      if (this.memoryCache[key]) {
        return this.memoryCache[key];
      }

      const filePath = path.join(this.stateDir, `${key}.json`);
      
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      this.memoryCache[key] = data;
      logger.info(`State loaded: ${key}`);
      return data;
    } catch (error) {
      logger.error(`Error loading state: ${key}`, error);
      return null;
    }
  }

  /**
   * Update state (merge with existing)
   */
  updateState(key, updates) {
    try {
      const existing = this.loadState(key) || {};
      const merged = { ...existing, ...updates };
      return this.saveState(key, merged);
    } catch (error) {
      logger.error(`Error updating state: ${key}`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete state
   */
  deleteState(key) {
    try {
      const filePath = path.join(this.stateDir, `${key}.json`);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      delete this.memoryCache[key];
      logger.info(`State deleted: ${key}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting state: ${key}`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get all state keys
   */
  getAllKeys() {
    try {
      const files = fs.readdirSync(this.stateDir);
      return files.map(f => f.replace('.json', ''));
    } catch (error) {
      logger.error('Error getting all keys', error);
      return [];
    }
  }

  /**
   * Clear all state
   */
  clearAllState() {
    try {
      const files = fs.readdirSync(this.stateDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(this.stateDir, file));
      });
      this.memoryCache = {};
      logger.info('All state cleared');
      return { success: true };
    } catch (error) {
      logger.error('Error clearing all state', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get state size in bytes
   */
  getStateSize() {
    try {
      const files = fs.readdirSync(this.stateDir);
      let totalSize = 0;

      files.forEach(file => {
        const filePath = path.join(this.stateDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });

      return {
        totalSize,
        files: files.length,
        formatted: `${(totalSize / 1024).toFixed(2)} KB`,
      };
    } catch (error) {
      logger.error('Error calculating state size', error);
      return { totalSize: 0, files: 0, formatted: '0 KB' };
    }
  }

  /**
   * Store temporary session data
   */
  storeSessionData(sessionId, key, value) {
    const sessionKey = `session:${sessionId}:${key}`;
    return this.saveState(sessionKey, value);
  }

  /**
   * Retrieve session data
   */
  getSessionData(sessionId, key) {
    const sessionKey = `session:${sessionId}:${key}`;
    return this.loadState(sessionKey);
  }

  /**
   * Clear session data
   */
  clearSessionData(sessionId) {
    try {
      const keys = this.getAllKeys();
      const sessionKeys = keys.filter(k => k.startsWith(`session:${sessionId}:`));
      
      sessionKeys.forEach(key => this.deleteState(key));
      
      logger.info(`Session data cleared: ${sessionId}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error clearing session data: ${sessionId}`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get agent workflow state
   */
  getAgentState(agentName) {
    return this.loadState(`agent:${agentName}`);
  }

  /**
   * Save agent workflow state
   */
  saveAgentState(agentName, state) {
    return this.saveState(`agent:${agentName}`, state);
  }
}

module.exports = new StateManager();
