/**
 * RatingService - Handles all rating-related operations
 * Part of Frontend MVC Implementation
 */

const RatingService = {
    /**
     * Get all ratings
     * @returns {Promise<Array>} - Array of ratings
     */
    async getAll() {
        try {
            return await API.Ratings.getAll();
        } catch (error) {
            console.error('RatingService.getAll error:', error);
            throw error;
        }
    },

    /**
     * Get ratings for a recipe
     * @param {number} recipeId - Recipe ID
     * @returns {Promise<Object>} - Ratings data with average and count
     */
    async getByRecipe(recipeId) {
        try {
            return await API.Ratings.getByRecipe(recipeId);
        } catch (error) {
            console.error('RatingService.getByRecipe error:', error);
            throw error;
        }
    },

    /**
     * Get rating by ID
     * @param {number} id - Rating ID
     * @returns {Promise<Object>} - Rating object
     */
    async getById(id) {
        try {
            return await API.Ratings.getById(id);
        } catch (error) {
            console.error('RatingService.getById error:', error);
            throw error;
        }
    },

    /**
     * Create new rating
     * @param {Object} ratingData - Rating data (recipe_id, rating)
     * @returns {Promise<Object>} - Created rating
     */
    async create(ratingData) {
        if (ratingData.rating < 1 || ratingData.rating > 5) {
            throw { message: 'Rating must be between 1 and 5' };
        }

        try {
            return await API.Ratings.create(ratingData);
        } catch (error) {
            console.error('RatingService.create error:', error);
            throw error;
        }
    },

    /**
     * Rate a recipe
     * @param {number} recipeId - Recipe ID
     * @param {number} rating - Rating value (1-5)
     * @returns {Promise<Object>} - Created rating
     */
    async rateRecipe(recipeId, rating) {
        return await this.create({
            recipe_id: recipeId,
            rating: rating
        });
    },

    /**
     * Update rating
     * @param {number} id - Rating ID
     * @param {number} rating - New rating value
     * @returns {Promise<Object>} - Updated rating
     */
    async update(id, rating) {
        try {
            return await API.Ratings.update(id, rating);
        } catch (error) {
            console.error('RatingService.update error:', error);
            throw error;
        }
    },

    /**
     * Delete rating
     * @param {number} id - Rating ID
     * @returns {Promise<Object>} - Deletion result
     */
    async delete(id) {
        try {
            return await API.Ratings.delete(id);
        } catch (error) {
            console.error('RatingService.delete error:', error);
            throw error;
        }
    },

    /**
     * Format rating as stars HTML
     * @param {number} rating - Rating value
     * @returns {string} - HTML stars
     */
    formatStars(rating) {
        const fullStars = Math.round(rating);
        const emptyStars = 5 - fullStars;
        return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    },

    /**
     * Format rating display
     * @param {Object} ratingsData - Ratings data object
     * @returns {string} - Formatted display string
     */
    formatDisplay(ratingsData) {
        const avg = ratingsData.average ? parseFloat(ratingsData.average).toFixed(1) : '0.0';
        const count = ratingsData.count || 0;
        return `${this.formatStars(parseFloat(avg))} ${avg} (${count} ratings)`;
    }
};

window.RatingService = RatingService;




