const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const dataLoader = require('../../utils/dataLoader');

/**
 * Main Agent - Orchestrates all other agents
 * Routes requests to appropriate agents and manages workflow
 */
class MainAgent {
  constructor() {
    this.id = uuidv4();
    this.agents = {};
    this.memory = {};
  }

  /**
   * Register a sub-agent
   */
  registerAgent(name, agent) {
    this.agents[name] = agent;
    logger.info(`Agent registered: ${name}`);
  }

  /**
   * Route request to appropriate agent
   */
  async routeRequest(type, payload) {
    try {
      logger.info(`Main Agent routing request`, { type, payload });

      switch (type) {
        case 'event:create':
          return await this.agents.resourceAgent.createEvent(payload);
        
        case 'event:list':
          return await this.agents.resourceAgent.listEvents();
        
        case 'event:get':
          return await this.agents.resourceAgent.getEvent(payload.id);
        
        case 'event:update':
          return await this.agents.resourceAgent.updateEvent(payload.id, payload.data);
        
        case 'event:delete':
          return await this.agents.resourceAgent.deleteEvent(payload.id);
        
        case 'event:review':
          return await this.agents.reviewAgent.reviewEvent(payload.id);
        
        case 'user:authenticate':
          return await this.agents.peopleAgent.authenticateUser(payload);
        
        case 'user:get':
          return await this.agents.peopleAgent.getUser(payload.id);
        
        case 'user:list':
          return await this.agents.peopleAgent.listUsers();
        
        case 'resource:allocate':
          return await this.agents.resourceAgent.allocateResource(payload);
        
        case 'resource:list':
          return await this.agents.resourceAgent.listResources();
        
        default:
          return { success: false, message: 'Unknown request type' };
      }
    } catch (error) {
      logger.error('Error routing request', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Store data in memory
   */
  storeMemory(key, value) {
    this.memory[key] = {
      value,
      timestamp: new Date(),
    };
  }

  /**
   * Retrieve data from memory
   */
  retrieveMemory(key) {
    return this.memory[key] || null;
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      mainAgent: { id: this.id, status: 'active' },
      subAgents: Object.keys(this.agents).map(name => ({
        name,
        status: this.agents[name].status || 'active',
      })),
      memorySize: Object.keys(this.memory).length,
    };
  }

  /**
   * Get all data across the system
   */
  async getAllData() {
    try {
      return dataLoader.getAllData();
    } catch (error) {
      logger.error('Error fetching all data', error);
      return null;
    }
  }
}

module.exports = new MainAgent();
