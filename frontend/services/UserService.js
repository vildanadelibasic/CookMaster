/**
 * UserService - Handles all user-related operations (admin)
 * Part of Frontend MVC Implementation
 */

const UserService = {
    _usersCache: [],

    /**
     * Get all users (admin only)
     * @returns {Promise<Array>} - Array of users
     */
    async getAll() {
        try {
            const users = await API.Users.getAll();
            this._usersCache = users || [];
            return this._usersCache;
        } catch (error) {
            console.error('UserService.getAll error:', error);
            throw error;
        }
    },

    /**
     * Get user by ID
     * @param {number} id - User ID
     * @returns {Promise<Object>} - User object
     */
    async getById(id) {
        try {
            return await API.Users.getById(id);
        } catch (error) {
            console.error('UserService.getById error:', error);
            throw error;
        }
    },

    /**
     * Create new user (admin only)
     * @param {Object} userData - User data
     * @returns {Promise<Object>} - Created user
     */
    async create(userData) {
        try {
            const result = await API.Users.create(userData);
            this._usersCache = [];
            return result;
        } catch (error) {
            console.error('UserService.create error:', error);
            throw error;
        }
    },

    /**
     * Update user
     * @param {number} id - User ID
     * @param {Object} userData - User data to update
     * @returns {Promise<Object>} - Updated user
     */
    async update(id, userData) {
        try {
            const result = await API.Users.update(id, userData);
            this._usersCache = [];
            return result;
        } catch (error) {
            console.error('UserService.update error:', error);
            throw error;
        }
    },

    /**
     * Delete user (admin only)
     * @param {number} id - User ID
     * @returns {Promise<Object>} - Deletion result
     */
    async delete(id) {
        try {
            const result = await API.Users.delete(id);
            this._usersCache = [];
            return result;
        } catch (error) {
            console.error('UserService.delete error:', error);
            throw error;
        }
    },

    /**
     * Change user role
     * @param {number} id - User ID
     * @param {string} role - New role
     * @returns {Promise<Object>} - Updated user
     */
    async changeRole(id, role) {
        return await this.update(id, { role });
    },

    /**
     * Get cached users
     * @returns {Array} - Cached users
     */
    getCachedUsers() {
        return this._usersCache;
    },

    /**
     * Get user statistics
     * @returns {Object} - Statistics object
     */
    getStatistics() {
        const users = this._usersCache;
        return {
            total: users.length,
            active: users.filter(u => u.status === 'active').length,
            admins: users.filter(u => u.role === 'admin').length,
            inactive: users.filter(u => u.status !== 'active').length
        };
    }
};

window.UserService = UserService;




