/**
 * FavoriteService - Handles all favorite-related operations
 * Part of Frontend MVC Implementation
 */

const FavoriteService = {
    _favoritesCache: [],

    /**
     * Get all favorites for current user
     * @returns {Promise<Array>} - Array of favorites
     */
    async getAll() {
        try {
            const favorites = await API.Favorites.getAll();
            this._favoritesCache = favorites || [];
            return this._favoritesCache;
        } catch (error) {
            console.error('FavoriteService.getAll error:', error);
            this._favoritesCache = [];
            throw error;
        }
    },

    /**
     * Get favorites for a specific user
     * @param {number} userId - User ID
     * @returns {Promise<Array>} - Array of favorites
     */
    async getByUser(userId) {
        try {
            return await API.Favorites.getByUser(userId);
        } catch (error) {
            console.error('FavoriteService.getByUser error:', error);
            throw error;
        }
    },

    /**
     * Add recipe to favorites
     * @param {number} recipeId - Recipe ID
     * @returns {Promise<Object>} - Created favorite
     */
    async add(recipeId) {
        try {
            const result = await API.Favorites.add(recipeId);
            this._favoritesCache.push({ recipe_id: recipeId });
            return result;
        } catch (error) {
            console.error('FavoriteService.add error:', error);
            throw error;
        }
    },

    /**
     * Remove favorite by ID
     * @param {number} id - Favorite ID
     * @returns {Promise<Object>} - Deletion result
     */
    async remove(id) {
        try {
            const result = await API.Favorites.remove(id);
            this._favoritesCache = this._favoritesCache.filter(f => f.favorite_id != id);
            return result;
        } catch (error) {
            console.error('FavoriteService.remove error:', error);
            throw error;
        }
    },

    /**
     * Remove favorite by recipe ID
     * @param {number} recipeId - Recipe ID
     * @returns {Promise<Object>} - Deletion result
     */
    async removeByRecipe(recipeId) {
        try {
            const result = await API.Favorites.removeByRecipe(recipeId);
            this._favoritesCache = this._favoritesCache.filter(f => f.recipe_id != recipeId);
            return result;
        } catch (error) {
            console.error('FavoriteService.removeByRecipe error:', error);
            throw error;
        }
    },

    /**
     * Toggle favorite status for a recipe
     * @param {number} recipeId - Recipe ID
     * @returns {Promise<Object>} - Result with isFavorite status
     */
    async toggle(recipeId) {
        const isFavorite = this.isFavorite(recipeId);
        
        if (isFavorite) {
            await this.removeByRecipe(recipeId);
            return { isFavorite: false, message: 'Removed from favorites' };
        } else {
            await this.add(recipeId);
            return { isFavorite: true, message: 'Added to favorites' };
        }
    },

    /**
     * Check if recipe is in favorites
     * @param {number} recipeId - Recipe ID
     * @returns {boolean}
     */
    isFavorite(recipeId) {
        return this._favoritesCache.some(f => f.recipe_id == recipeId);
    },

    /**
     * Get cached favorites
     * @returns {Array} - Cached favorites
     */
    getCachedFavorites() {
        return this._favoritesCache;
    },

    /**
     * Set cached favorites
     * @param {Array} favorites - Favorites to cache
     */
    setCachedFavorites(favorites) {
        this._favoritesCache = favorites || [];
    },

    /**
     * Get favorites count
     * @returns {number}
     */
    getCount() {
        return this._favoritesCache.length;
    },

    /**
     * Clear favorites cache
     */
    clearCache() {
        this._favoritesCache = [];
    }
};

window.FavoriteService = FavoriteService;




