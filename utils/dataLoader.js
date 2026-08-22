const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('./logger');

class DataLoader {
  constructor() {
    this.dataPath = config.dataPath;
    this.cache = {};
  }

  /**
   * Load JSON data from file
   */
  loadJSON(fileName) {
    try {
      // Return cached data if available
      if (this.cache[fileName]) {
        return this.cache[fileName];
      }

      const filePath = path.join(this.dataPath, `${fileName}.json`);
      
      if (!fs.existsSync(filePath)) {
        logger.warn(`File not found: ${filePath}`);
        return [];
      }

      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      this.cache[fileName] = data;
      logger.info(`Loaded data from ${fileName}.json`, { count: Array.isArray(data) ? data.length : Object.keys(data).length });
      
      return data;
    } catch (error) {
      logger.error(`Error loading ${fileName}.json`, error);
      return [];
    }
  }

  /**
   * Save JSON data to file
   */
  saveJSON(fileName, data) {
    try {
      const filePath = path.join(this.dataPath, `${fileName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      this.cache[fileName] = data; // Update cache
      logger.info(`Saved data to ${fileName}.json`);
      return true;
    } catch (error) {
      logger.error(`Error saving ${fileName}.json`, error);
      return false;
    }
  }

  /**
   * Get all data files
   */
  getAllData() {
    return {
      users: this.loadJSON('users'),
      events: this.loadJSON('events'),
      staff: this.loadJSON('staff'),
      students: this.loadJSON('students'),
      responses: this.loadJSON('responses'),
      venues: this.loadJSON('venues'),
      resources: this.loadJSON('resources'),
      rules: this.loadJSON('rules'),
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
    logger.info('Data cache cleared');
  }

  /**
   * Find item by ID in a data collection
   */
  findById(collection, id) {
    const data = this.loadJSON(collection);
    if (Array.isArray(data)) {
      return data.find(item => item.id === id || item.id === parseInt(id));
    }
    return data[id] || null;
  }

  /**
   * Find items by filter criteria
   */
  findBy(collection, criteria) {
    const data = this.loadJSON(collection);
    if (Array.isArray(data)) {
      return data.filter(item => {
        return Object.keys(criteria).every(key => item[key] === criteria[key]);
      });
    }
    return [];
  }
}

module.exports = new DataLoader();
