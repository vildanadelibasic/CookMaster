/**
 * AuthService - Handles all authentication-related operations
 * Part of Frontend MVC Implementation
 */

const AuthService = {
    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} - User data and token
     */
    async login(email, password) {
        if (typeof ValidationService !== 'undefined') {
            const validation = ValidationService.validateLogin(email, password);
            if (!validation.isValid) {
                throw { message: Object.values(validation.errors)[0] };
            }
        }

        const response = await API.Auth.login(email, password);
        
        if (response.user) {
            this.setCurrentUser(response.user);
        }
        
        return response;
    },

    /**
     * Register new user
     * @param {string} name - User full name
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} confirmPassword - Password confirmation
     * @returns {Promise<Object>} - User data and token
     */
    async register(name, email, password, confirmPassword) {
        if (typeof ValidationService !== 'undefined') {
            const validation = ValidationService.validateRegister(name, email, password, confirmPassword);
            if (!validation.isValid) {
                throw { message: Object.values(validation.errors)[0] };
            }
        }

        const response = await API.Auth.register(name, email, password);
        
        if (response.user) {
            this.setCurrentUser(response.user);
        }
        
        return response;
    },

    /**
     * Logout current user
     */
    logout() {
        API.Auth.logout();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
    },

    /**
     * Get current user profile
     * @returns {Promise<Object>} - User profile data
     */
    async getProfile() {
        return await API.Auth.getProfile();
    },

    /**
     * Update user profile
     * @param {Object} data - Profile data to update
     * @returns {Promise<Object>} - Updated user data
     */
    async updateProfile(data) {
        const response = await API.Auth.updateProfile(data);
        
        if (response.user) {
            this.setCurrentUser(response.user);
        }
        
        return response;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return API.Token.isAuthenticated();
    },

    /**
     * Check if current user is admin
     * @returns {boolean}
     */
    isAdmin() {
        return API.Token.isAdmin();
    },

    /**
     * Get current user data
     * @returns {Object|null}
     */
    getCurrentUser() {
        return API.Token.getUser();
    },

    /**
     * Set current user in local storage
     * @param {Object} user - User object
     */
    setCurrentUser(user) {
        localStorage.setItem('currentUser', user.name);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
    },

    /**
     * Get user display name
     * @returns {string}
     */
    getUserDisplayName() {
        const user = this.getCurrentUser();
        return user ? user.name : localStorage.getItem('currentUser') || 'Guest';
    },

    /**
     * Get user role
     * @returns {string}
     */
    getUserRole() {
        const user = this.getCurrentUser();
        return user ? user.role : localStorage.getItem('userRole') || 'guest';
    }
};

window.AuthService = AuthService;




