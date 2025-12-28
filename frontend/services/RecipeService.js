/**
 * RecipeService - Handles all recipe-related operations
 * Part of Frontend MVC Implementation
 */

const RecipeService = {
    _recipesCache: [],
    _categoriesCache: [],

    /**
     * Get all recipes
     * @returns {Promise<Array>} - Array of recipes
     */
    async getAll() {
        try {
            const recipes = await API.Recipes.getAll();
            this._recipesCache = recipes || [];
            return this._recipesCache;
        } catch (error) {
            console.error('RecipeService.getAll error:', error);
            throw error;
        }
    },

    /**
     * Get recipe by ID
     * @param {number} id - Recipe ID
     * @returns {Promise<Object>} - Recipe object
     */
    async getById(id) {
        try {
            return await API.Recipes.getById(id);
        } catch (error) {
            console.error('RecipeService.getById error:', error);
            throw error;
        }
    },

    /**
     * Create new recipe
     * @param {Object} recipeData - Recipe data
     * @returns {Promise<Object>} - Created recipe
     */
    async create(recipeData) {
        if (typeof ValidationService !== 'undefined') {
            const formData = {
                title: recipeData.title,
                category: recipeData.category_id,
                difficulty: recipeData.difficulty,
                prepTime: recipeData.prep_time,
                servings: recipeData.servings,
                description: recipeData.description,
                ingredients: recipeData.ingredients,
                instructions: recipeData.instructions,
                imageUrl: recipeData.image_url
            };
            
            const validation = ValidationService.validateRecipeSubmission(formData);
            if (!validation.isValid) {
                throw { message: Object.values(validation.errors)[0] };
            }
        }

        try {
            const result = await API.Recipes.create(recipeData);
            this._recipesCache = [];
            return result;
        } catch (error) {
            console.error('RecipeService.create error:', error);
            throw error;
        }
    },

    /**
     * Update recipe
     * @param {number} id - Recipe ID
     * @param {Object} recipeData - Recipe data to update
     * @returns {Promise<Object>} - Updated recipe
     */
    async update(id, recipeData) {
        try {
            const result = await API.Recipes.update(id, recipeData);
            this._recipesCache = [];
            return result;
        } catch (error) {
            console.error('RecipeService.update error:', error);
            throw error;
        }
    },

    /**
     * Delete recipe
     * @param {number} id - Recipe ID
     * @returns {Promise<Object>} - Deletion result
     */
    async delete(id) {
        try {
            const result = await API.Recipes.delete(id);
            this._recipesCache = [];
            return result;
        } catch (error) {
            console.error('RecipeService.delete error:', error);
            throw error;
        }
    },

    /**
     * Approve recipe (admin only)
     * @param {number} id - Recipe ID
     * @returns {Promise<Object>} - Updated recipe
     */
    async approve(id) {
        return await this.update(id, { status: 'active' });
    },

    /**
     * Get all categories
     * @returns {Promise<Array>} - Array of categories
     */
    async getCategories() {
        try {
            const categories = await API.Categories.getAll();
            this._categoriesCache = categories || [];
            return this._categoriesCache;
        } catch (error) {
            console.error('RecipeService.getCategories error:', error);
            throw error;
        }
    },

    /**
     * Get category name by ID
     * @param {number} categoryId - Category ID
     * @returns {string} - Category name
     */
    getCategoryName(categoryId) {
        if (!categoryId) return 'Uncategorized';
        const category = this._categoriesCache.find(c => c.cat_id == categoryId);
        return category ? category.name : 'Uncategorized';
    },

    /**
     * Get cached recipes
     * @returns {Array} - Cached recipes
     */
    getCachedRecipes() {
        return this._recipesCache;
    },

    /**
     * Get cached categories
     * @returns {Array} - Cached categories
     */
    getCachedCategories() {
        return this._categoriesCache;
    },

    /**
     * Get default image for category
     * @param {number} categoryId - Category ID
     * @returns {string} - Image URL
     */
    getDefaultImage(categoryId) {
        const images = {
            1: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
            2: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
            3: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
            4: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
            5: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400'
        };
        return images[categoryId] || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400';
    },

    /**
     * Filter recipes by search term and category
     * @param {Array} recipes - Recipes to filter
     * @param {string} searchTerm - Search term
     * @param {string} category - Category filter
     * @returns {Array} - Filtered recipes
     */
    filterRecipes(recipes, searchTerm = '', category = 'all') {
        return recipes.filter(recipe => {
            const matchesSearch = !searchTerm || 
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesCategory = category === 'all' || 
                this.getCategoryName(recipe.category_id).toLowerCase() === category.toLowerCase();
            
            return matchesSearch && matchesCategory;
        });
    },

    /**
     * Get trending recipes
     * @param {number} limit - Number of recipes to return
     * @returns {Array} - Trending recipes
     */
    getTrendingRecipes(limit = 3) {
        return this._recipesCache.slice(0, limit);
    },

    /**
     * Get pending recipes (for admin)
     * @returns {Array} - Pending recipes
     */
    getPendingRecipes() {
        return this._recipesCache.filter(r => r.status === 'pending');
    },

    /**
     * Get recipe statistics
     * @returns {Object} - Statistics object
     */
    getStatistics() {
        const recipes = this._recipesCache;
        return {
            total: recipes.length,
            pending: recipes.filter(r => r.status === 'pending').length,
            active: recipes.filter(r => r.status === 'active').length
        };
    }
};

window.RecipeService = RecipeService;




