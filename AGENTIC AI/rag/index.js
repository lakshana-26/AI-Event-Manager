const axios = require('axios');
const logger = require('../../utils/logger');
const dataLoader = require('../../utils/dataLoader');
const config = require('../../config');

/**
 * RAG (Retrieval-Augmented Generation) Service
 * Enhances agent capabilities with LLM-based context retrieval
 */
class RAGService {
  constructor() {
    this.llmApiKey = config.llmApiKey;
    this.llmModel = config.llmModel;
    this.llmProvider = config.llmProvider;
    this.knowledgeBase = {};
  }

  /**
   * Initialize knowledge base from data
   */
  initializeKnowledgeBase() {
    try {
      const allData = dataLoader.getAllData();
      
      this.knowledgeBase = {
        events: allData.events.map(e => `Event: ${e.name} (${e.date}) - ${e.description}`),
        users: allData.users.map(u => `User: ${u.name} (${u.role}) - ${u.email}`),
        venues: allData.venues.map(v => `Venue: ${v.name} - Capacity: ${v.capacity}`),
        resources: allData.resources.map(r => `Resource: ${r.name} (${r.type}) - Available: ${r.available}`),
        rules: allData.rules.map(r => `Rule: ${r.name} - ${r.description}`),
      };

      logger.info('RAG knowledge base initialized', { 
        events: this.knowledgeBase.events.length,
        users: this.knowledgeBase.users.length,
        venues: this.knowledgeBase.venues.length,
        resources: this.knowledgeBase.resources.length,
        rules: this.knowledgeBase.rules.length,
      });
    } catch (error) {
      logger.error('Error initializing knowledge base', error);
    }
  }

  /**
   * Retrieve relevant context for a query
   */
  retrieveContext(query, category = null) {
    try {
      const results = [];
      
      const categories = category ? [category] : Object.keys(this.knowledgeBase);

      for (const cat of categories) {
        if (this.knowledgeBase[cat]) {
          const matches = this.knowledgeBase[cat].filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
          );
          results.push({ category: cat, matches });
        }
      }

      return results;
    } catch (error) {
      logger.error('Error retrieving context', error);
      return [];
    }
  }

  /**
   * Generate response using LLM with RAG
   */
  async generateResponse(query, context = null) {
    try {
      if (!config.enableRag || !this.llmApiKey) {
        logger.warn('RAG or LLM API key not configured');
        return { success: false, message: 'RAG service not configured' };
      }

      // Retrieve context if not provided
      if (!context) {
        const retrievedContext = this.retrieveContext(query);
        context = retrievedContext;
      }

      // Format context for LLM
      const contextStr = Array.isArray(context) 
        ? context.map(c => `${c.category}: ${c.matches.join(', ')}`).join('\n')
        : context;

      const prompt = `Context:\n${contextStr}\n\nQuery: ${query}\n\nProvide a helpful response based on the context.`;

      // Call LLM API (example with OpenAI)
      if (this.llmProvider === 'openai') {
        return await this.callOpenAI(prompt);
      } else {
        return { success: false, message: `LLM provider ${this.llmProvider} not supported` };
      }
    } catch (error) {
      logger.error('Error generating response', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI(prompt) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.llmModel,
          messages: [
            { role: 'system', content: 'You are a helpful event management assistant.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.llmApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        response: response.data.choices[0].message.content,
      };
    } catch (error) {
      logger.error('Error calling OpenAI', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get suggestions for event based on context
   */
  async suggestEventImprovements(eventId) {
    try {
      const events = dataLoader.loadJSON('events');
      const event = events.find(e => e.id === eventId);

      if (!event) {
        return { success: false, message: 'Event not found' };
      }

      const query = `How can I improve this event: ${event.name} with budget ${event.budget}?`;
      const result = await this.generateResponse(query);

      return result;
    } catch (error) {
      logger.error('Error getting suggestions', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Search across all data
   */
  search(query) {
    try {
      const results = this.retrieveContext(query);
      return {
        success: true,
        results,
        totalMatches: results.reduce((sum, r) => sum + r.matches.length, 0),
      };
    } catch (error) {
      logger.error('Error searching', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update knowledge base with new data
   */
  updateKnowledgeBase(dataType, newItems) {
    try {
      if (this.knowledgeBase[dataType]) {
        this.knowledgeBase[dataType].push(...newItems);
        logger.info(`Knowledge base updated for ${dataType}`);
        return { success: true };
      }
      return { success: false, message: `Category ${dataType} not found` };
    } catch (error) {
      logger.error('Error updating knowledge base', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new RAGService();
