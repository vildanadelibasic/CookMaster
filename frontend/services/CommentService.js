/**
 * CommentService - Handles all comment-related operations
 * Part of Frontend MVC Implementation
 */

const CommentService = {
    _commentsCache: [],

    /**
     * Get all comments
     * @returns {Promise<Array>} - Array of comments
     */
    async getAll() {
        try {
            const comments = await API.Comments.getAll();
            this._commentsCache = comments || [];
            return this._commentsCache;
        } catch (error) {
            console.error('CommentService.getAll error:', error);
            throw error;
        }
    },

    /**
     * Get comments for a recipe
     * @param {number} recipeId - Recipe ID
     * @returns {Promise<Array>} - Array of comments
     */
    async getByRecipe(recipeId) {
        try {
            return await API.Comments.getByRecipe(recipeId);
        } catch (error) {
            console.error('CommentService.getByRecipe error:', error);
            throw error;
        }
    },

    /**
     * Get comment by ID
     * @param {number} id - Comment ID
     * @returns {Promise<Object>} - Comment object
     */
    async getById(id) {
        try {
            return await API.Comments.getById(id);
        } catch (error) {
            console.error('CommentService.getById error:', error);
            throw error;
        }
    },

    /**
     * Create new comment
     * @param {Object} commentData - Comment data
     * @returns {Promise<Object>} - Created comment
     */
    async create(commentData) {
        if (typeof ValidationService !== 'undefined') {
            const validation = ValidationService.validateComment(commentData.content);
            if (!validation.isValid) {
                throw { message: validation.errors.content };
            }
        }

        try {
            const result = await API.Comments.create(commentData);
            this._commentsCache = [];
            return result;
        } catch (error) {
            console.error('CommentService.create error:', error);
            throw error;
        }
    },

    /**
     * Update comment
     * @param {number} id - Comment ID
     * @param {Object} commentData - Comment data to update
     * @returns {Promise<Object>} - Updated comment
     */
    async update(id, commentData) {
        try {
            const result = await API.Comments.update(id, commentData);
            this._commentsCache = [];
            return result;
        } catch (error) {
            console.error('CommentService.update error:', error);
            throw error;
        }
    },

    /**
     * Delete comment
     * @param {number} id - Comment ID
     * @returns {Promise<Object>} - Deletion result
     */
    async delete(id) {
        try {
            const result = await API.Comments.delete(id);
            this._commentsCache = [];
            return result;
        } catch (error) {
            console.error('CommentService.delete error:', error);
            throw error;
        }
    },

    /**
     * Post a comment on a recipe
     * @param {number} recipeId - Recipe ID
     * @param {string} content - Comment content
     * @param {boolean} isQuestion - Is this a question?
     * @returns {Promise<Object>} - Created comment
     */
    async postComment(recipeId, content, isQuestion = false) {
        return await this.create({
            recipe_id: recipeId,
            content: content,
            is_question: isQuestion ? 1 : 0
        });
    },

    /**
     * Reply to a comment
     * @param {number} recipeId - Recipe ID
     * @param {number} parentId - Parent comment ID
     * @param {string} content - Reply content
     * @returns {Promise<Object>} - Created reply
     */
    async reply(recipeId, parentId, content) {
        return await this.create({
            recipe_id: recipeId,
            parent_id: parentId,
            content: content,
            is_question: 0
        });
    },

    /**
     * Get cached comments
     * @returns {Array} - Cached comments
     */
    getCachedComments() {
        return this._commentsCache;
    },

    /**
     * Filter questions only
     * @param {Array} comments - Comments to filter
     * @returns {Array} - Questions only
     */
    filterQuestions(comments) {
        return comments.filter(c => c.is_question == 1);
    },

    /**
     * Search comments
     * @param {Array} comments - Comments to search
     * @param {string} searchTerm - Search term
     * @returns {Array} - Matching comments
     */
    searchComments(comments, searchTerm) {
        if (!searchTerm) return comments;
        const term = searchTerm.toLowerCase();
        return comments.filter(c => 
            c.content && c.content.toLowerCase().includes(term)
        );
    }
};

window.CommentService = CommentService;




