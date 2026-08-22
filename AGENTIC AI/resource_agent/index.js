const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const dataLoader = require('../../utils/dataLoader');

/**
 * Resource Agent - Manages events, venues, and resources
 */
class ResourceAgent {
  constructor() {
    this.id = uuidv4();
    this.status = 'active';
  }

  /**
   * Create new event
   */
  async createEvent(eventData) {
    try {
      const events = dataLoader.loadJSON('events');
      
      const newEvent = {
        id: uuidv4(),
        ...eventData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      events.push(newEvent);
      dataLoader.saveJSON('events', events);

      logger.info('Event created', { eventId: newEvent.id });
      return { success: true, event: newEvent };
    } catch (error) {
      logger.error('Error creating event', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get event by ID
   */
  async getEvent(eventId) {
    try {
      const events = dataLoader.loadJSON('events');
      const event = events.find(e => e.id === eventId);

      if (!event) {
        return { success: false, message: 'Event not found' };
      }

      return { success: true, event };
    } catch (error) {
      logger.error('Error fetching event', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * List all events
   */
  async listEvents(filters = {}) {
    try {
      let events = dataLoader.loadJSON('events');

      if (filters.status) {
        events = events.filter(e => e.status === filters.status);
      }
      if (filters.organizerId) {
        events = events.filter(e => e.organizerId === filters.organizerId);
      }
      if (filters.date) {
        events = events.filter(e => e.date === filters.date);
      }

      return { success: true, events, count: events.length };
    } catch (error) {
      logger.error('Error listing events', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update event
   */
  async updateEvent(eventId, updateData) {
    try {
      const events = dataLoader.loadJSON('events');
      const index = events.findIndex(e => e.id === eventId);

      if (index === -1) {
        return { success: false, message: 'Event not found' };
      }

      events[index] = {
        ...events[index],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      dataLoader.saveJSON('events', events);

      logger.info('Event updated', { eventId });
      return { success: true, event: events[index] };
    } catch (error) {
      logger.error('Error updating event', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete event
   */
  async deleteEvent(eventId) {
    try {
      const events = dataLoader.loadJSON('events');
      const filteredEvents = events.filter(e => e.id !== eventId);

      if (filteredEvents.length === events.length) {
        return { success: false, message: 'Event not found' };
      }

      dataLoader.saveJSON('events', filteredEvents);

      logger.info('Event deleted', { eventId });
      return { success: true, message: 'Event deleted successfully' };
    } catch (error) {
      logger.error('Error deleting event', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Allocate resource to event
   */
  async allocateResource(allocation) {
    try {
      const { eventId, resourceId, quantity } = allocation;
      const events = dataLoader.loadJSON('events');
      const eventIndex = events.findIndex(e => e.id === eventId);

      if (eventIndex === -1) {
        return { success: false, message: 'Event not found' };
      }

      if (!events[eventIndex].allocatedResources) {
        events[eventIndex].allocatedResources = [];
      }

      events[eventIndex].allocatedResources.push({
        resourceId,
        quantity,
        allocatedAt: new Date().toISOString(),
      });

      dataLoader.saveJSON('events', events);

      logger.info('Resource allocated', { eventId, resourceId });
      return { success: true, message: 'Resource allocated successfully' };
    } catch (error) {
      logger.error('Error allocating resource', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * List venues
   */
  async listVenues(filters = {}) {
    try {
      let venues = dataLoader.loadJSON('venues');

      if (filters.capacity) {
        venues = venues.filter(v => v.capacity >= filters.capacity);
      }
      if (filters.availability) {
        venues = venues.filter(v => v.availability === filters.availability);
      }

      return { success: true, venues, count: venues.length };
    } catch (error) {
      logger.error('Error listing venues', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * List resources
   */
  async listResources(filters = {}) {
    try {
      let resources = dataLoader.loadJSON('resources');

      if (filters.type) {
        resources = resources.filter(r => r.type === filters.type);
      }
      if (filters.available) {
        resources = resources.filter(r => r.available === filters.available);
      }

      return { success: true, resources, count: resources.length };
    } catch (error) {
      logger.error('Error listing resources', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get agent info
   */
  getInfo() {
    return {
      id: this.id,
      name: 'ResourceAgent',
      status: this.status,
      capabilities: [
        'createEvent',
        'getEvent',
        'listEvents',
        'updateEvent',
        'deleteEvent',
        'allocateResource',
        'listVenues',
        'listResources',
      ],
    };
  }
}

module.exports = new ResourceAgent();
