const logger = require('../../utils/logger');

/**
 * Utility tools for agents
 */
const tools = {
  /**
   * Validate email format
   */
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate date format
   */
  validateDate: (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },

  /**
   * Check if date is in future
   */
  isFutureDate: (dateString) => {
    return new Date(dateString) > new Date();
  },

  /**
   * Format date to readable string
   */
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Calculate event duration in hours
   */
  calculateDuration: (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end - start) / (1000 * 60 * 60);
  },

  /**
   * Generate unique ID
   */
  generateId: () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Deep clone object
   */
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Merge objects
   */
  mergeObjects: (obj1, obj2) => {
    return { ...obj1, ...obj2 };
  },

  /**
   * Check if object is empty
   */
  isEmpty: (obj) => {
    return Object.keys(obj).length === 0;
  },

  /**
   * Paginate array
   */
  paginate: (array, page = 1, pageSize = 10) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      data: array.slice(start, end),
      page,
      pageSize,
      total: array.length,
      totalPages: Math.ceil(array.length / pageSize),
    };
  },

  /**
   * Sort array by key
   */
  sortBy: (array, key, order = 'asc') => {
    const sorted = [...array].sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  },

  /**
   * Group array by key
   */
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  },

  /**
   * Filter by multiple criteria
   */
  filterBy: (array, criteria) => {
    return array.filter(item =>
      Object.keys(criteria).every(key => item[key] === criteria[key])
    );
  },

  /**
   * Calculate average
   */
  average: (array, key) => {
    const sum = array.reduce((acc, item) => acc + (item[key] || 0), 0);
    return array.length > 0 ? sum / array.length : 0;
  },

  /**
   * Send email notification (placeholder)
   */
  sendEmailNotification: async (email, subject, message) => {
    try {
      logger.info(`Email would be sent to ${email}`, { subject, message });
      // Implement actual email sending here (e.g., nodemailer, SendGrid)
      return { success: true, message: 'Email notification queued' };
    } catch (error) {
      logger.error('Error sending email notification', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Validate event data
   */
  validateEventData: (event) => {
    const errors = [];

    if (!event.name || event.name.trim() === '') {
      errors.push('Event name is required');
    }

    if (!event.date || !tools.validateDate(event.date)) {
      errors.push('Valid event date is required');
    }

    if (event.date && !tools.isFutureDate(event.date)) {
      errors.push('Event date must be in the future');
    }

    if (event.expectedAttendees && event.expectedAttendees <= 0) {
      errors.push('Expected attendees must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

module.exports = tools;
