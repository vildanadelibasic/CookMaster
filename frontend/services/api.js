const API_BASE_URL = 'http://localhost/CookMaster/backend';
const TokenService = {
    getToken() {
        return localStorage.getItem('jwt_token');
    },
    setToken(token) {
        localStorage.setItem('jwt_token', token);
    },
    removeToken() {
        localStorage.removeItem('jwt_token');
    },
    getUser() {
        const userStr = localStorage.getItem('user_data');
        return userStr ? JSON.parse(userStr) : null;
    },
    setUser(user) {
        localStorage.setItem('user_data', JSON.stringify(user));
    },
    removeUser() {
        localStorage.removeItem('user_data');
    },
    isAuthenticated() {
        return !!this.getToken();
    },
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },
    clearAll() {
        this.removeToken();
        this.removeUser();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
    }
};
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };
    const token = TokenService.getToken();
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        if (!response.ok) {
            throw {
                status: response.status,
                message: data.error || 'An error occurred',
                data: data
            };
        }
        return data;
    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw {
            status: 0,
            message: 'Network error. Please check your connection.',
            data: null
        };
    }
}
const AuthAPI = {
    async login(email, password) {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
        if (response.token) {
            TokenService.setToken(response.token);
            TokenService.setUser(response.user);
        }
        return response;
    },
    async register(name, email, password) {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: { name, email, password }
        });
        if (response.token) {
            TokenService.setToken(response.token);
            TokenService.setUser(response.user);
        }
        return response;
    },
    async getProfile() {
        return await apiRequest('/auth/me', {
            method: 'GET'
        });
    },
    async updateProfile(data) {
        const response = await apiRequest('/auth/profile', {
            method: 'PUT',
            body: data
        });
        if (response.token) {
            TokenService.setToken(response.token);
            TokenService.setUser(response.user);
        }
        return response;
    },
    logout() {
        TokenService.clearAll();
    }
};
const RecipesAPI = {
    async getAll() {
        return await apiRequest('/recipes', { method: 'GET' });
    },
    async getById(id) {
        return await apiRequest(`/recipes/${id}`, { method: 'GET' });
    },
    async create(recipeData) {
        return await apiRequest('/recipes', {
            method: 'POST',
            body: recipeData
        });
    },
    async update(id, recipeData) {
        return await apiRequest(`/recipes/${id}`, {
            method: 'PUT',
            body: recipeData
        });
    },
    async delete(id) {
        return await apiRequest(`/recipes/${id}`, {
            method: 'DELETE'
        });
    }
};
const UsersAPI = {
    async getAll() {
        return await apiRequest('/users', { method: 'GET' });
    },
    async getById(id) {
        return await apiRequest(`/users/${id}`, { method: 'GET' });
    },
    async create(userData) {
        return await apiRequest('/users', {
            method: 'POST',
            body: userData
        });
    },
    async update(id, userData) {
        return await apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: userData
        });
    },
    async delete(id) {
        return await apiRequest(`/users/${id}`, {
            method: 'DELETE'
        });
    }
};
const CategoriesAPI = {
    async getAll() {
        return await apiRequest('/categories', { method: 'GET' });
    },
    async getById(id) {
        return await apiRequest(`/categories/${id}`, { method: 'GET' });
    },
    async create(categoryData) {
        return await apiRequest('/categories', {
            method: 'POST',
            body: categoryData
        });
    },
    async update(id, categoryData) {
        return await apiRequest(`/categories/${id}`, {
            method: 'PUT',
            body: categoryData
        });
    },
    async delete(id) {
        return await apiRequest(`/categories/${id}`, {
            method: 'DELETE'
        });
    }
};
const CommentsAPI = {
    async getAll() {
        return await apiRequest('/comments', { method: 'GET' });
    },
    async getByRecipe(recipeId) {
        return await apiRequest(`/comments/recipe/${recipeId}`, { method: 'GET' });
    },
    async getById(id) {
        return await apiRequest(`/comments/${id}`, { method: 'GET' });
    },
    async create(commentData) {
        return await apiRequest('/comments', {
            method: 'POST',
            body: commentData
        });
    },
    async update(id, commentData) {
        return await apiRequest(`/comments/${id}`, {
            method: 'PUT',
            body: commentData
        });
    },
    async delete(id) {
        return await apiRequest(`/comments/${id}`, {
            method: 'DELETE'
        });
    }
};
const FavoritesAPI = {
    async getAll() {
        return await apiRequest('/favorites', { method: 'GET' });
    },
    async getByUser(userId) {
        return await apiRequest(`/favorites/user/${userId}`, { method: 'GET' });
    },
    async add(recipeId) {
        return await apiRequest('/favorites', {
            method: 'POST',
            body: { recipe_id: recipeId }
        });
    },
    async remove(id) {
        return await apiRequest(`/favorites/${id}`, {
            method: 'DELETE'
        });
    },
    async removeByRecipe(recipeId) {
        return await apiRequest(`/favorites/recipe/${recipeId}`, {
            method: 'DELETE'
        });
    }
};
const RatingsAPI = {
    async getAll() {
        return await apiRequest('/ratings', { method: 'GET' });
    },
    async getByRecipe(recipeId) {
        return await apiRequest(`/ratings/recipe/${recipeId}`, { method: 'GET' });
    },
    async getById(id) {
        return await apiRequest(`/ratings/${id}`, { method: 'GET' });
    },
    async create(ratingData) {
        return await apiRequest('/ratings', {
            method: 'POST',
            body: ratingData
        });
    },
    async update(id, rating) {
        return await apiRequest(`/ratings/${id}`, {
            method: 'PUT',
            body: { rating }
        });
    },
    async delete(id) {
        return await apiRequest(`/ratings/${id}`, {
            method: 'DELETE'
        });
    }
};
window.API = {
    Auth: AuthAPI,
    Recipes: RecipesAPI,
    Users: UsersAPI,
    Categories: CategoriesAPI,
    Comments: CommentsAPI,
    Favorites: FavoritesAPI,
    Ratings: RatingsAPI,
    Token: TokenService,
    BASE_URL: API_BASE_URL
};
console.log('✅ API Service loaded successfully');
