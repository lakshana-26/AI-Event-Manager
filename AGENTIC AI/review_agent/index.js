const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const dataLoader = require('../../utils/dataLoader');

/**
 * Review Agent - Validates events against rules and manages approvals
 */
class ReviewAgent {
  constructor() {
    this.id = uuidv4();
    this.status = 'active';
  }

  /**
   * Review and validate event
   */
  async reviewEvent(eventId) {
    try {
      const events = dataLoader.loadJSON('events');
      const rules = dataLoader.loadJSON('rules');
      
      const event = events.find(e => e.id === eventId);
      if (!event) {
        return { success: false, message: 'Event not found' };
      }

      // Validate against rules
      const validationResult = this.validateEventAgainstRules(event, rules);

      if (!validationResult.isValid) {
        return {
          success: false,
          message: 'Event validation failed',
          violations: validationResult.violations,
        };
      }

      // Approve event
      const eventIndex = events.findIndex(e => e.id === eventId);
      events[eventIndex].status = 'approved';
      events[eventIndex].reviewedAt = new Date().toISOString();
      events[eventIndex].reviewedBy = 'ReviewAgent';

      dataLoader.saveJSON('events', events);

      logger.info('Event reviewed and approved', { eventId });
      return {
        success: true,
        message: 'Event approved',
        event: events[eventIndex],
      };
    } catch (error) {
      logger.error('Error reviewing event', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Validate event against rules
   */
  validateEventAgainstRules(event, rules) {
    const violations = [];

    for (const rule of rules) {
      if (!this.checkRule(event, rule)) {
        violations.push({
          rule: rule.name,
          description: rule.description,
          severity: rule.severity,
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  /**
   * Check individual rule
   */
  checkRule(event, rule) {
    try {
      // Example rules implementation
      switch (rule.type) {
        case 'capacity':
          return event.expectedAttendees <= rule.maxCapacity;
        
        case 'date':
          return new Date(event.date) > new Date();
        
        case 'duration':
          return event.duration <= rule.maxDuration;
        
        case 'budget':
          return event.budget <= rule.maxBudget;
        
        case 'location':
          return rule.allowedLocations.includes(event.location);
        
        default:
          return true;
      }
    } catch (error) {
      logger.warn(`Error checking rule: ${rule.name}`, error);
      return true;
    }
  }

  /**
   * Get review history for event
   */
  async getReviewHistory(eventId) {
    try {
      const responses = dataLoader.loadJSON('responses');
      const reviews = responses.filter(r => r.eventId === eventId && r.type === 'review');

      return { success: true, reviews, count: reviews.length };
    } catch (error) {
      logger.error('Error fetching review history', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Reject event
   */
  async rejectEvent(eventId, reason) {
    try {
      const events = dataLoader.loadJSON('events');
      const index = events.findIndex(e => e.id === eventId);

      if (index === -1) {
        return { success: false, message: 'Event not found' };
      }

      events[index].status = 'rejected';
      events[index].rejectionReason = reason;
      events[index].reviewedAt = new Date().toISOString();
      events[index].reviewedBy = 'ReviewAgent';

      dataLoader.saveJSON('events', events);

      logger.info('Event rejected', { eventId });
      return { success: true, message: 'Event rejected' };
    } catch (error) {
      logger.error('Error rejecting event', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get pending reviews
   */
  async getPendingReviews() {
    try {
      const events = dataLoader.loadJSON('events');
      const pending = events.filter(e => e.status === 'pending');

      return { success: true, events: pending, count: pending.length };
    } catch (error) {
      logger.error('Error fetching pending reviews', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get agent info
   */
  getInfo() {
    return {
      id: this.id,
      name: 'ReviewAgent',
      status: this.status,
      capabilities: [
        'reviewEvent',
        'rejectEvent',
        'getReviewHistory',
        'getPendingReviews',
        'validateEventAgainstRules',
      ],
    };
  }
}

module.exports = new ReviewAgent();
