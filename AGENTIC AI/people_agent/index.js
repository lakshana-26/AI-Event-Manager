const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const logger = require('../../utils/logger');
const dataLoader = require('../../utils/dataLoader');

/**
 * People Agent - Manages users, staff, and students
 */
class PeopleAgent {
  constructor() {
    this.id = uuidv4();
    this.status = 'active';
  }

  /**
   * Authenticate user
   */
  async authenticateUser(credentials) {
    try {
      const { email, password } = credentials;
      const users = dataLoader.loadJSON('users');
      
      const user = users.find(u => u.email === email);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Compare password (in production, passwords should be hashed)
      const passwordMatch = password === user.password || 
                           await bcrypt.compare(password, user.password || '');
      
      if (!passwordMatch) {
        return { success: false, message: 'Invalid credentials' };
      }

      return {
        success: true,
        user: { id: user.id, email: user.email, role: user.role, name: user.name },
      };
    } catch (error) {
      logger.error('Authentication error', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get user by ID
   */
  async getUser(userId) {
    try {
      const users = dataLoader.loadJSON('users');
      const user = users.find(u => u.id === userId || u.id === parseInt(userId));
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      return { success: true, user };
    } catch (error) {
      logger.error('Error fetching user', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * List all users
   */
  async listUsers(filters = {}) {
    try {
      let users = dataLoader.loadJSON('users');
      
      // Apply filters
      if (filters.role) {
        users = users.filter(u => u.role === filters.role);
      }
      if (filters.status) {
        users = users.filter(u => u.status === filters.status);
      }

      return { success: true, users, count: users.length };
    } catch (error) {
      logger.error('Error listing users', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    try {
      const users = dataLoader.loadJSON('users');
      
      const newUser = {
        id: uuidv4(),
        ...userData,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      dataLoader.saveJSON('users', users);

      logger.info('User created', { userId: newUser.id });
      return { success: true, user: newUser };
    } catch (error) {
      logger.error('Error creating user', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update user
   */
  async updateUser(userId, updateData) {
    try {
      const users = dataLoader.loadJSON('users');
      const index = users.findIndex(u => u.id === userId);

      if (index === -1) {
        return { success: false, message: 'User not found' };
      }

      users[index] = { ...users[index], ...updateData, updatedAt: new Date().toISOString() };
      dataLoader.saveJSON('users', users);

      logger.info('User updated', { userId });
      return { success: true, user: users[index] };
    } catch (error) {
      logger.error('Error updating user', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * List staff members
   */
  async listStaff(filters = {}) {
    try {
      let staff = dataLoader.loadJSON('staff');
      
      if (filters.department) {
        staff = staff.filter(s => s.department === filters.department);
      }

      return { success: true, staff, count: staff.length };
    } catch (error) {
      logger.error('Error listing staff', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * List students
   */
  async listStudents(filters = {}) {
    try {
      let students = dataLoader.loadJSON('students');
      
      if (filters.year) {
        students = students.filter(s => s.year === filters.year);
      }

      return { success: true, students, count: students.length };
    } catch (error) {
      logger.error('Error listing students', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get agent info
   */
  getInfo() {
    return {
      id: this.id,
      name: 'PeopleAgent',
      status: this.status,
      capabilities: [
        'authenticateUser',
        'getUser',
        'listUsers',
        'createUser',
        'updateUser',
        'listStaff',
        'listStudents',
      ],
    };
  }
}

module.exports = new PeopleAgent();
