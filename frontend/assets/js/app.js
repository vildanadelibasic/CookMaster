let currentUser = null;
let userRole = null;
let viewsLoaded = false;
let isLoading = false;
let allRecipes = [];
let allCategories = [];
let userFavorites = [];
function showLoading() {
    isLoading = true;
    let loader = document.getElementById('global-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); display: flex; justify-content: center; align-items: center; z-index: 9999;';
        loader.innerHTML = '<div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"><span class="visually-hidden">Loading...</span></div>';
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
}
function hideLoading() {
    isLoading = false;
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}
async function loadAllViews() {
    if (viewsLoaded) return;
    console.log('📦 Loading all pages...');
    const pages = [
        'home', 'recipes', 'recipe-details', 'favorites', 
        'submit-recipe', 'community', 'login', 'register',
        'admin-dashboard', 'admin-recipes', 'admin-users'
    ];
    const container = document.getElementById('app-container');
    container.innerHTML = '';
    for (const page of pages) {
        try {
            const response = await fetch(`pages/${page}.html`);
            const html = await response.text();
            const div = document.createElement('div');
            div.id = `view-${page}`;
            div.className = 'app-view';
            if (page === 'home') div.classList.add('active');
            div.innerHTML = html;
            container.appendChild(div);
            console.log(`✅ Loaded: ${page}`);
        } catch (error) {
            console.error(`❌ Failed to load ${page}:`, error);
        }
    }
    viewsLoaded = true;
    console.log('✅ All pages loaded!');
}
function showView(viewName) {
    console.log(`📄 Showing: ${viewName}`);
    window.location.hash = viewName;
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('active');
        window.scrollTo(0, 0);
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        setupPage(viewName);
    }
}
function setupPage(pageName) {
    setTimeout(() => {
        const adminOnlyPages = ['admin-dashboard', 'admin-users', 'admin-recipes'];
        if (adminOnlyPages.includes(pageName)) {
            if (!isAuthenticated() || !isAdmin()) {
                showAccessDenied('admin');
                return;
            }
        }
        const authRequiredPages = ['favorites', 'submit-recipe'];
        if (authRequiredPages.includes(pageName)) {
            if (!isAuthenticated()) {
                showAccessDenied('login');
                return;
            }
        }
        if (pageName === 'home') {
            loadHomePage();
        } else if (pageName === 'recipes') {
            setupRecipesPage();
            loadRecipesFromBackend();
        } else if (pageName === 'recipe-details') {
            if (!window.currentRecipeId) {
                const container = document.getElementById('recipe-details-container');
                if (container) {
                    container.innerHTML = `
                        <div class="text-center py-5">
                            <i class="fas fa-utensils fa-5x text-muted mb-4"></i>
                            <h3>No Recipe Selected</h3>
                            <p class="text-muted">Please select a recipe to view its details.</p>
                            <button class="btn btn-primary" onclick="showView('recipes')">
                                <i class="fas fa-book-open"></i> Browse Recipes
                            </button>
                        </div>
                    `;
                }
            }
        } else if (pageName === 'community') {
            setupCommunityPage();
            loadCommunityComments();
        } else if (pageName === 'login') {
            if (isAuthenticated()) {
                showToast('✅ You are already logged in!', 'info');
                showView(isAdmin() ? 'admin-dashboard' : 'home');
                return;
            }
            setupLoginPage();
        } else if (pageName === 'register') {
            if (isAuthenticated()) {
                showToast('✅ You are already logged in!', 'info');
                showView('home');
                return;
            }
            setupRegisterPage();
        } else if (pageName === 'submit-recipe') {
            setupSubmitRecipePage();
        } else if (pageName === 'favorites') {
            loadFavoritesPage();
        } else if (pageName === 'admin-dashboard') {
            loadAdminDashboard();
        } else if (pageName === 'admin-users') {
            loadAdminUsers();
            setupDataTables();
        } else if (pageName === 'admin-recipes') {
            loadAdminRecipes();
            setupDataTables();
        }
    }, 100);
}
function isAuthenticated() {
    if (typeof API !== 'undefined') {
        return API.Token.isAuthenticated();
    }
    return !!localStorage.getItem('currentUser');
}
function isAdmin() {
    if (typeof API !== 'undefined') {
        return API.Token.isAdmin();
    }
    return localStorage.getItem('userRole') === 'admin';
}
function getCurrentUser() {
    if (typeof API !== 'undefined') {
        return API.Token.getUser();
    }
    return {
        name: localStorage.getItem('currentUser'),
        email: localStorage.getItem('userEmail'),
        role: localStorage.getItem('userRole')
    };
}
function showAccessDenied(type = 'login') {
    const container = document.querySelector('.app-view.active');
    if (!container) return;
    if (type === 'admin') {
        container.innerHTML = `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card shadow-lg mt-5">
                            <div class="card-body text-center p-5">
                                <i class="fas fa-shield-alt fa-5x text-danger mb-4"></i>
                                <h2 class="text-danger">Access Denied</h2>
                                <p class="text-muted mb-4">
                                    This page is only accessible to administrators.<br>
                                    Please login with an admin account to continue.
                                </p>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" onclick="showView('login')">
                                        <i class="fas fa-sign-in-alt"></i> Login as Admin
                                    </button>
                                    <button class="btn btn-outline-secondary" onclick="showView('home')">
                                        <i class="fas fa-home"></i> Go to Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card shadow-lg mt-5">
                            <div class="card-body text-center p-5">
                                <i class="fas fa-lock fa-5x text-warning mb-4"></i>
                                <h2>Login Required</h2>
                                <p class="text-muted mb-4">
                                    You need to be logged in to access this page.<br>
                                    Please login or create an account to continue.
                                </p>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" onclick="showView('login')">
                                        <i class="fas fa-sign-in-alt"></i> Login
                                    </button>
                                    <button class="btn btn-outline-primary" onclick="showView('register')">
                                        <i class="fas fa-user-plus"></i> Create Account
                                    </button>
                                    <button class="btn btn-outline-secondary" onclick="showView('home')">
                                        <i class="fas fa-home"></i> Go to Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
async function loadHomePage() {
    console.log('🏠 Loading home page...');
    updateHomeWelcome();
    try {
        if (typeof API !== 'undefined') {
            const recipes = await API.Recipes.getAll();
            if (recipes && recipes.length > 0) {
                allRecipes = recipes;
                const trendingRecipes = recipes.slice(0, 3);
                renderTrendingRecipes(trendingRecipes);
            } else {
                const loader = document.getElementById('trendingRecipesLoader');
                if (loader) {
                    loader.innerHTML = '<p class="text-muted">No recipes yet. Be the first to share one!</p>';
                }
            }
        }
    } catch (error) {
        console.error('Error loading home page:', error);
        const loader = document.getElementById('trendingRecipesLoader');
        if (loader) {
            loader.innerHTML = '<p class="text-danger">Failed to load recipes. Please try again.</p>';
        }
    }
}
function updateHomeWelcome() {
    const welcomeTitle = document.getElementById('homeWelcomeTitle');
    const welcomeSubtitle = document.getElementById('homeWelcomeSubtitle');
    const homeActions = document.getElementById('homeActions');
    const ctaTitle = document.getElementById('ctaTitle');
    const ctaSubtitle = document.getElementById('ctaSubtitle');
    const ctaButtons = document.getElementById('ctaButtons');
    if (isAuthenticated()) {
        const user = getCurrentUser();
        if (welcomeTitle) {
            welcomeTitle.innerHTML = `<i class="fas fa-utensils"></i> Welcome back, ${user.name}!`;
        }
        if (welcomeSubtitle) {
            welcomeSubtitle.textContent = 'Ready to discover or share some delicious recipes?';
        }
        if (homeActions) {
            homeActions.innerHTML = `
                <button class="btn btn-light btn-lg me-2" onclick="showView('submit-recipe')">
                    <i class="fas fa-plus-circle"></i> Share a Recipe
                </button>
                <button class="btn btn-outline-light btn-lg" onclick="showView('favorites')">
                    <i class="fas fa-heart"></i> My Favorites
                </button>
            `;
        }
        if (ctaTitle) {
            ctaTitle.textContent = 'Share Your Culinary Creations';
        }
        if (ctaSubtitle) {
            ctaSubtitle.textContent = 'Got a recipe you love? Share it with our community!';
        }
        if (ctaButtons) {
            ctaButtons.innerHTML = `
                <button class="btn btn-primary btn-lg me-2" onclick="showView('submit-recipe')">
                    <i class="fas fa-plus-circle"></i> Submit Recipe
                </button>
                <button class="btn btn-outline-primary btn-lg" onclick="showView('community')">
                    <i class="fas fa-comments"></i> Join Discussion
                </button>
            `;
        }
    } else {
        if (welcomeTitle) {
            welcomeTitle.innerHTML = '<i class="fas fa-utensils"></i> Welcome to CookMaster';
        }
        if (welcomeSubtitle) {
            welcomeSubtitle.textContent = 'Discover, Share, and Master Your Favorite Recipes';
        }
        if (homeActions) {
            homeActions.innerHTML = `
                <button class="btn btn-light btn-lg me-2" onclick="showView('recipes')">
                    <i class="fas fa-book-open"></i> Explore Recipes
                </button>
                <button class="btn btn-outline-light btn-lg" onclick="showView('register')">
                    <i class="fas fa-user-plus"></i> Join Now
                </button>
            `;
        }
        if (ctaTitle) {
            ctaTitle.textContent = 'Ready to Start Your Culinary Journey?';
        }
        if (ctaSubtitle) {
            ctaSubtitle.textContent = 'Join thousands of home cooks and professional chefs sharing their passion for food.';
        }
        if (ctaButtons) {
            ctaButtons.innerHTML = `
                <button class="btn btn-primary btn-lg" onclick="showView('register')">
                    <i class="fas fa-rocket"></i> Get Started Now
                </button>
            `;
        }
    }
}
function renderTrendingRecipes(recipes) {
    const container = document.getElementById('trendingRecipesContainer');
    const loader = document.getElementById('trendingRecipesLoader');
    if (loader) loader.style.display = 'none';
    if (!container) return;
    let html = '';
    recipes.forEach(recipe => {
        const imageUrl = recipe.image_url || getDefaultImage(recipe.category_id);
        html += `
            <div class="col-md-4 mb-4">
                <div class="card recipe-card">
                    <span class="badge bg-danger">Trending</span>
                    <img src="${imageUrl}" class="card-img-top" alt="${recipe.title}" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400'"
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.description ? recipe.description.substring(0, 80) + '...' : 'Delicious recipe'}</p>
                        <div class="recipe-meta">
                            <span class="recipe-meta-item">
                                <i class="fas fa-clock"></i> ${recipe.prep_time || 30} min
                            </span>
                            <span class="recipe-meta-item">
                                <i class="fas fa-fire"></i> ${capitalizeFirst(recipe.difficulty || 'Medium')}
                            </span>
                        </div>
                        <button class="btn btn-primary w-100 mt-2" onclick="loadRecipeDetails(${recipe.recipe_id})">
                            View Recipe
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}
async function loadRecipesFromBackend() {
    showLoading();
    try {
        if (typeof API !== 'undefined') {
            const [recipes, categories] = await Promise.all([
                API.Recipes.getAll(),
                API.Categories.getAll()
            ]);
            console.log('Recipes loaded:', recipes);
            console.log('Categories loaded:', categories);
            allRecipes = recipes || [];
            allCategories = categories || [];
            if (API.Token.isAuthenticated()) {
                try {
                    userFavorites = await API.Favorites.getAll();
                } catch (e) {
                    userFavorites = [];
                }
            }
            renderRecipes(allRecipes);
            populateCategoryFilter(allCategories);
        }
    } catch (error) {
        console.error('Load recipes error:', error);
        showToast('❌ Failed to load recipes', 'error');
    } finally {
        hideLoading();
    }
}
function renderRecipes(recipes) {
    const container = document.getElementById('recipesContainer');
    if (!container) return;
    if (!recipes || recipes.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-book-open fa-5x text-muted mb-3"></i>
                <h4>No recipes found</h4>
                <p class="text-muted">Be the first to share a recipe!</p>
                <button class="btn btn-primary" onclick="showView('submit-recipe')">
                    <i class="fas fa-plus"></i> Submit Recipe
                </button>
            </div>
        `;
            return;
        }
    let html = '';
    recipes.forEach(recipe => {
        const imageUrl = recipe.image_url || getDefaultImage(recipe.category_id);
        const isFavorite = userFavorites.some(f => f.recipe_id == recipe.recipe_id);
        const categoryName = getCategoryName(recipe.category_id);
        const statusBadge = recipe.status === 'active' ? 
            '<span class="badge bg-success">Approved</span>' : 
            '<span class="badge bg-warning">Pending</span>';
        html += `
            <div class="col-md-4 mb-4 recipe-item" 
                 data-title="${recipe.title.toLowerCase()}" 
                 data-category="${categoryName.toLowerCase()}"
                 data-category-id="${recipe.category_id}"
                 data-difficulty="${(recipe.difficulty || 'medium').toLowerCase()}"
                 data-recipe-id="${recipe.recipe_id}">
                <div class="card recipe-card">
                    <button class="favorite-btn" onclick="toggleFavorite(this, ${recipe.recipe_id})" data-recipe-id="${recipe.recipe_id}">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    ${statusBadge}
                    <img src="${imageUrl}" class="card-img-top" alt="${recipe.title}" 
                         onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400'"
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.description ? recipe.description.substring(0, 60) + '...' : ''}</p>
                        <div class="recipe-meta mb-3">
                            <span class="recipe-meta-item">
                                <i class="fas fa-clock"></i> ${recipe.prep_time || 30} min
                            </span>
                            <span class="recipe-meta-item">
                                <i class="fas fa-fire"></i> ${capitalizeFirst(recipe.difficulty || 'Medium')}
                            </span>
                            <span class="recipe-meta-item">
                                <i class="fas fa-tag"></i> ${categoryName}
                            </span>
                        </div>
                        <button class="btn btn-primary w-100" onclick="loadRecipeDetails(${recipe.recipe_id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    updateResultsCount();
}
function populateCategoryFilter(categories) {
    const select = document.getElementById('categoryFilter');
    if (!select) return;
    let html = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        html += `<option value="${cat.name.toLowerCase()}">${cat.name}</option>`;
    });
    select.innerHTML = html;
}
function setupRecipesPage() {
    console.log('🔧 Setting up Recipes page...');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    if (!searchInput || !categoryFilter) return;
    window.filterRecipes = function() {
        const searchText = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const recipes = document.querySelectorAll('.recipe-item');
        let visibleCount = 0;
        recipes.forEach(recipe => {
            const title = recipe.getAttribute('data-title') || '';
            const recipeCategory = recipe.getAttribute('data-category') || '';
            const matchesSearch = title.includes(searchText);
            const matchesCategory = category === 'all' || recipeCategory === category;
            if (matchesSearch && matchesCategory) {
                recipe.style.display = 'block';
                visibleCount++;
            } else {
                recipe.style.display = 'none';
            }
        });
        updateResultsCount(visibleCount);
    };
    console.log('✅ Recipes page ready!');
}
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        if (count === undefined) {
            const visible = document.querySelectorAll('.recipe-item:not([style*="display: none"])');
            count = visible.length;
        }
        resultsCount.textContent = `Showing ${count} recipe(s)`;
    }
}
window.loadRecipeDetails = async function(recipeId) {
    console.log('📖 Loading recipe details:', recipeId);
    showLoading();
    window.currentRecipeId = recipeId;
    try {
        if (typeof API === 'undefined') {
            showToast('❌ API not available', 'error');
            hideLoading();
            return;
        }
        const [recipe, ratingsData, comments] = await Promise.all([
            API.Recipes.getById(recipeId),
            API.Ratings.getByRecipe(recipeId),
            API.Comments.getByRecipe(recipeId)
        ]);
        if (!recipe) {
            showToast('❌ Recipe not found', 'error');
            hideLoading();
            return;
        }
        showView('recipe-details');
        setTimeout(() => {
            renderRecipeDetails(recipe, ratingsData, comments);
            hideLoading();
        }, 300);
    } catch (error) {
        console.error('Load recipe details error:', error);
        showToast('❌ Failed to load recipe details', 'error');
        hideLoading();
    }
};
function renderRecipeDetails(recipe, ratingsData, comments) {
    console.log('🎨 Rendering recipe details:', recipe.title);
    const imageUrl = recipe.image_url || getDefaultImage(recipe.category_id);
    const categoryName = getCategoryName(recipe.category_id);
    window.currentRecipeId = recipe.recipe_id;
    const titleEl = document.getElementById('recipeTitle');
    const authorEl = document.getElementById('recipeAuthor');
    const imageEl = document.getElementById('recipeImage');
    const prepTimeEl = document.getElementById('recipePrepTime');
    const servingsEl = document.getElementById('recipeServings');
    const difficultyEl = document.getElementById('recipeDifficulty');
    const categoryEl = document.getElementById('recipeCategory');
    const descriptionEl = document.getElementById('recipeDescription');
    const ingredientsList = document.getElementById('recipeIngredients');
    const instructionsList = document.getElementById('recipeInstructions');
    if (titleEl) titleEl.textContent = recipe.title;
    if (authorEl) authorEl.textContent = recipe.author_name || 'Anonymous Chef';
    if (imageEl) imageEl.src = imageUrl;
    if (prepTimeEl) prepTimeEl.textContent = `${recipe.prep_time || 30} minutes`;
    if (servingsEl) servingsEl.textContent = `${recipe.servings || 4} people`;
    if (difficultyEl) difficultyEl.textContent = capitalizeFirst(recipe.difficulty || 'Medium');
    if (categoryEl) categoryEl.textContent = categoryName;
    if (descriptionEl) descriptionEl.textContent = recipe.description || 'A delicious recipe';
    if (ingredientsList) {
        if (recipe.ingredients) {
            const ingredients = recipe.ingredients.split('\n').filter(i => i.trim());
            ingredientsList.innerHTML = ingredients.map(ing => 
                `<li><i class="fas fa-check text-success"></i> ${ing}</li>`
            ).join('');
        } else {
            ingredientsList.innerHTML = '<li>No ingredients listed</li>';
        }
    }
    if (instructionsList) {
        if (recipe.instructions) {
            const instructions = recipe.instructions.split('\n').filter(i => i.trim());
            instructionsList.innerHTML = instructions.map((inst, idx) => 
                `<li><strong>Step ${idx + 1}:</strong> ${inst}</li>`
            ).join('');
        } else {
            instructionsList.innerHTML = '<li>No instructions available</li>';
        }
    }
    renderRecipeRating(ratingsData);
    renderRecipeComments(comments, recipe.recipe_id);
    const isFavorite = userFavorites.some(f => f.recipe_id == recipe.recipe_id);
    updateFavoriteButton(isFavorite);
    console.log('✅ Recipe details rendered successfully!');
}
function renderRecipeRating(ratingsData) {
    const likesSpan = document.getElementById('recipeLikes');
    if (likesSpan) {
        const avg = ratingsData.average ? parseFloat(ratingsData.average).toFixed(1) : 0;
        const count = ratingsData.count || 0;
        likesSpan.innerHTML = `
            <span class="text-warning">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5 - Math.round(avg))}</span>
            ${avg} (${count} ratings)
        `;
    }
    if (typeof API !== 'undefined' && API.Token.isAuthenticated()) {
        addRatingSection();
    }
}
function addRatingSection() {
    const container = document.getElementById('recipe-details-container');
    if (!container) return;
    if (document.getElementById('userRatingSection')) return;
    if (!isAuthenticated()) return;
    const quickInfoCard = container.querySelector('.col-md-4 .card.mb-3');
    if (quickInfoCard) {
        const ratingHtml = `
            <div id="userRatingSection" class="mt-3 pt-3 border-top">
                <strong><i class="fas fa-star text-warning"></i> Rate this recipe:</strong>
                <div class="rating-stars mt-2">
                    ${[1,2,3,4,5].map(i => `
                        <i class="far fa-star fa-lg text-warning rating-star" 
                           data-rating="${i}" 
                           onclick="rateRecipe(${i})"
                           style="cursor: pointer;"></i>
                    `).join('')}
                </div>
            </div>
        `;
        quickInfoCard.querySelector('.card-body').insertAdjacentHTML('beforeend', ratingHtml);
    }
}
window.rateRecipe = async function(rating) {
    if (!isAuthenticated()) {
        showToast('❌ Please login to rate recipes', 'error');
        showView('login');
        return;
    }
    if (!window.currentRecipeId) {
        showToast('❌ No recipe selected', 'error');
        return;
    }
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach(star => star.style.pointerEvents = 'none');
    try {
        await API.Ratings.create({
            recipe_id: window.currentRecipeId,
            rating: rating
        });
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
        showToast(`⭐ Thanks for rating! You gave ${rating} stars`, 'success');
        const ratingsData = await API.Ratings.getByRecipe(window.currentRecipeId);
        renderRecipeRating(ratingsData);
    } catch (error) {
        console.error('Rating error:', error);
        showToast(`❌ ${error.message || 'Failed to rate recipe'}`, 'error');
    } finally {
        stars.forEach(star => star.style.pointerEvents = 'auto');
    }
};
function renderRecipeComments(comments, recipeId) {
    const container = document.getElementById('commentsList');
    if (!container) return;
    let html = '';
    if (isAuthenticated()) {
        const user = getCurrentUser();
        html += `
            <div class="mb-4 p-3 bg-light rounded">
                <div class="d-flex align-items-center mb-2">
                    <i class="fas fa-user-circle fa-2x text-primary me-2"></i>
                    <strong>${user.name || 'User'}</strong>
                </div>
                <textarea id="newCommentText" class="form-control mb-2" rows="3" placeholder="Share your thoughts about this recipe..."></textarea>
                <button class="btn btn-primary" onclick="submitRecipeComment(${recipeId})">
                    <i class="fas fa-paper-plane"></i> Post Comment
                </button>
            </div>
        `;
    } else {
        html += `
            <div class="alert alert-light border mb-4 text-center py-3">
                <i class="fas fa-comment-dots fa-2x text-muted mb-2"></i>
                <p class="mb-2">Want to share your thoughts?</p>
                <button class="btn btn-primary btn-sm me-2" onclick="showView('login')">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="showView('register')">
                    <i class="fas fa-user-plus"></i> Register
                </button>
            </div>
        `;
    }
    if (!comments || comments.length === 0) {
        html += '<p class="text-muted text-center">No comments yet. Be the first to comment!</p>';
    } else {
        html += `<h6 class="mb-3">${comments.length} Comment(s)</h6>`;
        comments.forEach(comment => {
            const isOwner = isAuthenticated() && getCurrentUser().name === comment.user_name;
            html += `
                <div class="border-bottom pb-3 mb-3">
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-user-circle fa-2x text-primary me-2"></i>
                        <div class="flex-grow-1">
                            <strong>${comment.user_name || 'Anonymous'}</strong>
                            ${isOwner ? '<span class="badge bg-primary ms-2">You</span>' : ''}
                            <br><small class="text-muted">${formatDate(comment.created_at)}</small>
                        </div>
                    </div>
                    <p class="mb-0">${comment.content}</p>
                </div>
            `;
        });
    }
    container.innerHTML = html;
}
window.submitRecipeComment = async function(recipeId) {
    if (!isAuthenticated()) {
        showToast('❌ Please login to post comments', 'error');
        showView('login');
        return;
    }
    const textarea = document.getElementById('newCommentText');
    const content = textarea.value.trim();
    if (!content) {
        showToast('❌ Please write a comment', 'error');
        return;
    }
    const btn = textarea.nextElementSibling;
    if (btn) btn.disabled = true;
    try {
        await API.Comments.create({
            recipe_id: recipeId,
            content: content,
            is_question: 0
        });
        textarea.value = '';
        showToast('✅ Comment posted!', 'success');
        const comments = await API.Comments.getByRecipe(recipeId);
        renderRecipeComments(comments, recipeId);
    } catch (error) {
        console.error('Comment error:', error);
        showToast(`❌ ${error.message || 'Failed to post comment'}`, 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
};
function updateFavoriteButton(isFavorite) {
    const btn = document.getElementById('favoriteBtn');
    if (!btn) return;
    if (!isAuthenticated()) {
        btn.innerHTML = '<i class="fas fa-heart"></i> Login to Favorite';
        btn.classList.remove('btn-danger', 'btn-outline-danger');
        btn.classList.add('btn-secondary');
        btn.onclick = function() {
            showToast('❌ Please login to add favorites', 'error');
            showView('login');
        };
        return;
    }
    btn.classList.remove('btn-secondary');
    if (isFavorite) {
        btn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-outline-danger');
    } else {
        btn.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
        btn.classList.remove('btn-outline-danger');
        btn.classList.add('btn-danger');
    }
    btn.onclick = toggleRecipeFavorite;
}
window.toggleRecipeFavorite = async function() {
    if (!window.currentRecipeId) return;
    if (!isAuthenticated()) {
        showToast('❌ Please login to add favorites', 'error');
        showView('login');
        return;
    }
    const btn = document.getElementById('favoriteBtn');
    if (btn) btn.disabled = true;
    try {
        const isFavorite = userFavorites.some(f => f.recipe_id == window.currentRecipeId);
        if (isFavorite) {
            await API.Favorites.removeByRecipe(window.currentRecipeId);
            userFavorites = userFavorites.filter(f => f.recipe_id != window.currentRecipeId);
            showToast('💔 Removed from favorites', 'success');
        } else {
            await API.Favorites.add(window.currentRecipeId);
            userFavorites.push({ recipe_id: window.currentRecipeId });
            showToast('❤️ Added to favorites!', 'success');
        }
        updateFavoriteButton(!isFavorite);
    } catch (error) {
        console.error('Favorite error:', error);
        showToast(`❌ ${error.message || 'Failed to update favorites'}`, 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
};
async function loadFavoritesPage() {
    console.log('❤️ Loading favorites page...');
    if (typeof API === 'undefined' || !API.Token.isAuthenticated()) {
        showToast('❌ Please login to view favorites', 'error');
        showView('login');
        return;
    }
    showLoading();
    try {
        const favorites = await API.Favorites.getAll();
        userFavorites = favorites || [];
        console.log('Favorites loaded:', favorites);
        renderFavorites(favorites);
    } catch (error) {
        console.error('Load favorites error:', error);
        showToast('❌ Failed to load favorites', 'error');
    } finally {
        hideLoading();
    }
}
function renderFavorites(favorites) {
    const container = document.getElementById('favoritesContainer');
    const countAlert = document.querySelector('#view-favorites .alert');
    const emptyState = document.getElementById('emptyState');
    if (!container) return;
    if (countAlert) {
        countAlert.innerHTML = `<i class="fas fa-heart"></i> You have <strong>${favorites.length}</strong> recipes in your favorites`;
    }
    if (!favorites || favorites.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('d-none');
        return;
    }
    if (emptyState) emptyState.classList.add('d-none');
    let html = '';
    favorites.forEach(fav => {
        const favId = fav.favorite_id || fav.fav_id;
        const recipeId = fav.recipe_id;
        const title = fav.title || 'Untitled Recipe';
        const description = fav.description || '';
        const imageUrl = fav.image_url || getDefaultImage(fav.category_id);
        const prepTime = fav.prep_time || 30;
        const difficulty = fav.difficulty || 'Medium';
        html += `
            <div class="col-md-4 mb-4" data-favorite-id="${favId}" data-recipe-id="${recipeId}">
                <div class="card recipe-card">
                    <button class="favorite-btn">
                        <i class="fas fa-heart"></i>
                    </button>
                    <span class="badge bg-success">Favorite</span>
                    <img src="${imageUrl}" class="card-img-top" alt="${title}" 
                         onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400'">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description ? description.substring(0, 60) + '...' : ''}</p>
                        <div class="recipe-meta mb-3">
                            <span class="recipe-meta-item">
                                <i class="fas fa-clock"></i> ${prepTime} min
                            </span>
                            <span class="recipe-meta-item">
                                <i class="fas fa-fire"></i> ${capitalizeFirst(difficulty)}
                            </span>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" onclick="loadRecipeDetails(${recipeId})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button class="btn btn-outline-danger" onclick="removeFavorite(${favId}, ${recipeId}, this)">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}
window.removeFavorite = async function(favoriteId, recipeId, btn) {
    btn.disabled = true;
    try {
        if (favoriteId && favoriteId !== recipeId) {
            await API.Favorites.remove(favoriteId);
        } else {
            await API.Favorites.removeByRecipe(recipeId);
        }
        const card = btn.closest('.col-md-4');
        if (card) {
            card.remove();
        }
        userFavorites = userFavorites.filter(f => f.favorite_id != favoriteId && f.recipe_id != recipeId);
        const countAlert = document.querySelector('#view-favorites .alert');
        if (countAlert) {
            countAlert.innerHTML = `<i class="fas fa-heart"></i> You have <strong>${userFavorites.length}</strong> recipes in your favorites`;
        }
        showToast('💔 Removed from favorites', 'success');
        if (userFavorites.length === 0) {
            const emptyState = document.getElementById('emptyState');
            if (emptyState) emptyState.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Remove favorite error:', error);
        showToast(`❌ ${error.message || 'Failed to remove favorite'}`, 'error');
        btn.disabled = false;
    }
};
window.toggleFavorite = async function(button, recipeId) {
    if (!isAuthenticated()) {
        showToast('❌ Please login to add favorites', 'error');
        showView('login');
        return;
    }
    const icon = button.querySelector('i');
    const isFavorite = icon.classList.contains('fas');
    button.disabled = true;
    try {
        if (isFavorite) {
            await API.Favorites.removeByRecipe(recipeId);
            icon.classList.remove('fas');
            icon.classList.add('far');
            userFavorites = userFavorites.filter(f => f.recipe_id != recipeId);
            showToast('💔 Removed from favorites', 'success');
        } else {
            await API.Favorites.add(recipeId);
            icon.classList.remove('far');
            icon.classList.add('fas');
            userFavorites.push({ recipe_id: recipeId });
            showToast('❤️ Added to favorites!', 'success');
        }
    } catch (error) {
        console.error('Toggle favorite error:', error);
        showToast(`❌ ${error.message || 'Failed to update favorites'}`, 'error');
    } finally {
        button.disabled = false;
    }
};
async function loadCommunityComments() {
    console.log('💬 Loading community comments...');
    try {
        if (typeof API !== 'undefined') {
            const comments = await API.Comments.getAll();
            console.log('Community comments loaded:', comments);
            renderCommunityComments(comments);
        }
    } catch (error) {
        console.error('Load community error:', error);
    }
}
function updateCommunityAuthUI() {
    const commentForm = document.getElementById('communityCommentForm');
    const loginPrompt = document.getElementById('communityLoginPrompt');
    if (isAuthenticated()) {
        if (commentForm) commentForm.classList.remove('d-none');
        if (loginPrompt) loginPrompt.classList.add('d-none');
    } else {
        if (commentForm) commentForm.classList.add('d-none');
        if (loginPrompt) loginPrompt.classList.remove('d-none');
    }
}
function renderCommunityComments(comments) {
    const container = document.getElementById('communityCommentsArea');
    if (!container) return;
    if (!comments || comments.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-4">
                <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                <p class="text-muted">No comments yet. Be the first to share your thoughts!</p>
            </div>
        `;
        updateCommentsCount(0);
        return;
    }
    let html = '';
    comments.forEach(comment => {
        const isQuestion = comment.is_question == 1;
        const questionBadge = isQuestion ? '<span class="badge bg-warning">Question</span>' : '';
        const contentForSearch = (comment.content || '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
        html += `
            <div class="col-md-12 mb-3 community-comment-item" 
                 data-likes="0" 
                 data-question="${isQuestion}" 
                 data-content="${contentForSearch}"
                 data-comment-id="${comment.comment_id}">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex mb-3">
                            <i class="fas fa-user-circle fa-3x text-primary me-3"></i>
                            <div class="flex-grow-1">
                                <h6>${comment.user_name || 'Anonymous'} ${questionBadge}</h6>
                                <small class="text-muted">${formatDate(comment.created_at)}</small>
                            </div>
                        </div>
                        <p>${comment.content}</p>
                        ${comment.recipe_id ? `<a href="javascript:void(0)" onclick="loadRecipeDetails(${comment.recipe_id})" class="text-primary"><i class="fas fa-utensils"></i> View Related Recipe</a>` : ''}
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-primary community-like-btn" data-id="${comment.comment_id}">
                                <i class="fas fa-thumbs-up"></i> Like
                            </button>
                            <button class="btn btn-sm btn-outline-secondary community-reply-btn" data-id="${comment.comment_id}">
                                <i class="fas fa-reply"></i> Reply
                            </button>
                        </div>
                        <div class="d-none mt-2 community-reply-form" data-id="${comment.comment_id}">
                            <textarea class="form-control mb-2 community-reply-text" rows="2" placeholder="Write your reply..."></textarea>
                            <button class="btn btn-sm btn-primary community-submit-reply" data-id="${comment.comment_id}" data-recipe-id="${comment.recipe_id}">Post</button>
                            <button class="btn btn-sm btn-secondary community-cancel-reply" data-id="${comment.comment_id}">Cancel</button>
                        </div>
                        <div class="community-replies-area" data-id="${comment.comment_id}"></div>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    attachCommentEventListeners();
    updateCommentsCount(comments.length);
}
function setupCommunityPage() {
    console.log('🔧 Setting up Community page...');
    updateCommunityAuthUI();
    const postBtn = document.getElementById('communityPostBtn');
    if (postBtn) {
        postBtn.onclick = async function() {
            if (!isAuthenticated()) {
                showToast('❌ Please login to post a comment', 'error');
                showView('login');
                return;
            }
            const textarea = document.getElementById('communityNewCommentText');
            const isQuestion = document.getElementById('communityIsQuestion');
            const text = textarea.value.trim();
            if (!text) {
                showToast('❌ Please write something!', 'error');
                return;
            }
            try {
                await API.Comments.create({
                    recipe_id: 1,
                    content: text,
                    is_question: isQuestion.checked ? 1 : 0
                });
                textarea.value = '';
                isQuestion.checked = false;
                showToast('✅ Comment posted!', 'success');
                loadCommunityComments();
            } catch (error) {
                console.error('Post comment error:', error);
                showToast(`❌ ${error.message || 'Failed to post comment'}`, 'error');
            }
        };
    }
    const searchBox = document.getElementById('communitySearchBox');
    if (searchBox) {
        searchBox.onkeyup = function() {
            filterCommunityComments();
        };
    }
    const btnRecent = document.getElementById('communityBtnRecent');
    const btnPopular = document.getElementById('communityBtnPopular');
    const btnQuestions = document.getElementById('communityBtnQuestions');
    if (btnRecent) {
        btnRecent.onclick = function() {
            setActiveFilterButton(this);
            sortCommentsByRecent();
        };
    }
    if (btnPopular) {
        btnPopular.onclick = function() {
            setActiveFilterButton(this);
            sortCommentsByPopular();
        };
    }
    if (btnQuestions) {
        btnQuestions.onclick = function() {
            setActiveFilterButton(this);
            filterQuestions();
        };
    }
    console.log('✅ Community page ready!');
}
function attachCommentEventListeners() {
    document.querySelectorAll('.community-like-btn').forEach(btn => {
        btn.onclick = function() {
            const commentItem = this.closest('.community-comment-item');
            if (this.classList.contains('btn-outline-primary')) {
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary');
                showToast('👍 Liked!', 'success');
            } else {
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline-primary');
            }
        };
    });
    document.querySelectorAll('.community-reply-btn').forEach(btn => {
        btn.onclick = function() {
            const id = this.getAttribute('data-id');
            const form = document.querySelector(`.community-reply-form[data-id="${id}"]`);
            if (form) {
                form.classList.toggle('d-none');
            }
        };
    });
    document.querySelectorAll('.community-submit-reply').forEach(btn => {
        btn.onclick = async function() {
            if (typeof API === 'undefined' || !API.Token.isAuthenticated()) {
                showToast('❌ Please login to reply', 'error');
                showView('login');
                return;
            }
            const id = this.getAttribute('data-id');
            const recipeId = this.getAttribute('data-recipe-id');
            const textarea = document.querySelector(`.community-reply-form[data-id="${id}"] .community-reply-text`);
            const repliesArea = document.querySelector(`.community-replies-area[data-id="${id}"]`);
            const text = textarea.value.trim();
            if (!text) {
                showToast('❌ Please write a reply!', 'error');
                return;
            }
            try {
                await API.Comments.create({
                    recipe_id: recipeId || 1,
                    content: text,
                    parent_id: parseInt(id),
                    is_question: 0
                });
                const user = API.Token.getUser();
            const replyHTML = `
                <div class="mt-2 ms-4 border-start border-primary border-3 ps-3">
                        <small><strong>${user ? user.name : 'You'}</strong> - Just now</small>
                    <p class="mb-0">${text}</p>
                </div>
            `;
            repliesArea.insertAdjacentHTML('beforeend', replyHTML);
            textarea.value = '';
            const form = document.querySelector(`.community-reply-form[data-id="${id}"]`);
            if (form) {
                form.classList.add('d-none');
            }
                showToast('✅ Reply posted!', 'success');
            } catch (error) {
                console.error('Reply error:', error);
                showToast(`❌ ${error.message || 'Failed to post reply'}`, 'error');
            }
        };
    });
    document.querySelectorAll('.community-cancel-reply').forEach(btn => {
        btn.onclick = function() {
            const id = this.getAttribute('data-id');
            const form = document.querySelector(`.community-reply-form[data-id="${id}"]`);
            if (form) {
                form.classList.add('d-none');
                const textarea = form.querySelector('.community-reply-text');
                if (textarea) textarea.value = '';
            }
        };
    });
}
function filterCommunityComments() {
    const searchText = document.getElementById('communitySearchBox').value.toLowerCase();
    const comments = document.querySelectorAll('.community-comment-item');
    let visibleCount = 0;
    comments.forEach(comment => {
        const content = comment.getAttribute('data-content') || '';
        if (content.includes(searchText)) {
            comment.style.display = 'block';
            visibleCount++;
        } else {
            comment.style.display = 'none';
        }
    });
    updateCommentsCount(visibleCount);
}
function setActiveFilterButton(activeBtn) {
    document.querySelectorAll('#communityBtnRecent, #communityBtnPopular, #communityBtnQuestions').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}
function sortCommentsByRecent() {
    const comments = document.querySelectorAll('.community-comment-item');
    comments.forEach(comment => {
        comment.style.display = 'block';
    });
    updateCommentsCount();
}
function sortCommentsByPopular() {
    const commentsArea = document.getElementById('communityCommentsArea');
    const comments = Array.from(commentsArea.querySelectorAll('.community-comment-item'));
    comments.sort((a, b) => {
        const likesA = parseInt(a.getAttribute('data-likes')) || 0;
        const likesB = parseInt(b.getAttribute('data-likes')) || 0;
        return likesB - likesA;
    });
    comments.forEach(comment => {
        commentsArea.appendChild(comment);
        comment.style.display = 'block';
    });
    updateCommentsCount();
}
function filterQuestions() {
    const comments = document.querySelectorAll('.community-comment-item');
    let visibleCount = 0;
    comments.forEach(comment => {
        const isQuestion = comment.getAttribute('data-question') === 'true';
        if (isQuestion) {
            comment.style.display = 'block';
            visibleCount++;
        } else {
            comment.style.display = 'none';
        }
    });
    updateCommentsCount(visibleCount);
}
function updateCommentsCount(count) {
    const countEl = document.getElementById('communityCount');
    if (!countEl) return;
    if (count === undefined) {
        const visibleComments = document.querySelectorAll('.community-comment-item:not([style*="display: none"])');
        count = visibleComments.length;
    }
    countEl.textContent = `Showing ${count} comment(s)`;
}
function setupSubmitRecipePage() {
    console.log('🔧 Setting up Submit Recipe page...');
    const recipeForm = document.getElementById('recipeForm');
    if (!recipeForm) return;
    loadCategoriesForForm();
    const newForm = recipeForm.cloneNode(true);
    recipeForm.parentNode.replaceChild(newForm, recipeForm);
    const imageInput = newForm.querySelector('#submitRecipeImage');
    if (imageInput) {
        imageInput.onchange = function(e) {
            const url = e.target.value;
            const preview = document.getElementById('submitImagePreview');
            if (preview && url) {
                preview.innerHTML = `<img src="${url}" class="img-fluid rounded" style="max-height: 200px;" onerror="this.style.display='none'">`;
            }
        };
    }
    newForm.onsubmit = async function(e) {
        e.preventDefault();
        if (!isAuthenticated()) {
            showToast('❌ Please login to submit a recipe', 'error');
            showView('login');
            return;
        }
        const title = document.getElementById('submitRecipeTitle').value;
        const category = document.getElementById('submitRecipeCategory').value;
        const difficulty = document.getElementById('submitRecipeDifficulty').value;
        const prepTime = document.getElementById('submitPrepTime').value;
        const servings = document.getElementById('submitServings').value;
        const description = document.getElementById('submitRecipeDescription').value;
        const ingredients = document.getElementById('submitRecipeIngredients').value;
        const instructions = document.getElementById('submitRecipeInstructions').value;
        const imageUrl = document.getElementById('submitRecipeImage').value;
        const submitBtn = newForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        try {
            if (typeof API !== 'undefined') {
                const recipeData = {
                    title,
                    description,
                    ingredients,
                    instructions,
                    category_id: parseInt(category) || null,
                    prep_time: parseInt(prepTime),
                    servings: parseInt(servings),
                    difficulty,
                    image_url: imageUrl || null,
                    status: 'pending'
                };
                await API.Recipes.create(recipeData);
                showToast('✅ Recipe submitted successfully! It will be reviewed by our moderators.', 'success');
                newForm.reset();
                const preview = document.getElementById('submitImagePreview');
                if (preview) preview.innerHTML = '';
                showView('recipes');
            }
        } catch (error) {
            console.error('Submit recipe error:', error);
            showToast(`❌ ${error.message || 'Failed to submit recipe'}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    };
    console.log('✅ Submit Recipe page ready!');
}
async function loadCategoriesForForm() {
    try {
        if (typeof API !== 'undefined') {
            const categories = await API.Categories.getAll();
            allCategories = categories || [];
            const select = document.getElementById('submitRecipeCategory');
            if (select && categories && categories.length > 0) {
                select.innerHTML = '<option value="">Select a category</option>' + 
                    categories.map(cat => `<option value="${cat.cat_id}">${cat.name}</option>`).join('');
            }
        }
    } catch (error) {
        console.error('Load categories error:', error);
    }
}
async function loadAdminDashboard() {
    console.log('📊 Loading admin dashboard...');
    try {
        if (typeof API !== 'undefined') {
            const [recipes, users, comments, categories] = await Promise.all([
                API.Recipes.getAll(),
                API.Users.getAll().catch(() => []),
                API.Comments.getAll().catch(() => []),
                API.Categories.getAll().catch(() => [])
            ]);
            allCategories = categories || [];
            const totalRecipes = document.querySelector('#view-admin-dashboard .stat-recipes');
            const totalUsers = document.querySelector('#view-admin-dashboard .stat-users');
            const pendingRecipes = document.querySelector('#view-admin-dashboard .stat-pending');
            const totalComments = document.querySelector('#view-admin-dashboard .stat-comments');
            if (totalRecipes) totalRecipes.textContent = recipes.length;
            if (totalUsers) totalUsers.textContent = users.length;
            if (totalComments) totalComments.textContent = comments.length;
            if (pendingRecipes) {
                const pending = recipes.filter(r => r.status === 'pending').length;
                pendingRecipes.textContent = pending;
            }
            const categoryStats = document.getElementById('categoryStats');
            if (categoryStats && categories.length > 0) {
                let catHtml = '<div class="mb-3">';
                categories.forEach((cat, index) => {
                    const recipeCount = recipes.filter(r => r.category_id == cat.cat_id).length;
                    const colors = ['primary', 'success', 'warning', 'danger', 'info', 'secondary'];
                    catHtml += `<span class="badge bg-${colors[index % colors.length]} me-2 mb-2">${cat.name}: ${recipeCount}</span>`;
                });
                catHtml += '</div>';
                categoryStats.innerHTML = catHtml;
            }
            const activityBody = document.getElementById('recentActivityBody');
            if (activityBody) {
                let activityHtml = '';
                const recentComments = comments.slice(0, 5);
                recentComments.forEach(comment => {
                    activityHtml += `
                        <tr>
                            <td><small>${formatDate(comment.created_at)}</small></td>
                            <td>${comment.user_name || 'User'}</td>
                            <td><i class="fas fa-comment text-info"></i> Comment</td>
                            <td>${comment.content ? comment.content.substring(0, 40) + '...' : '-'}</td>
                            <td><span class="badge bg-success">Published</span></td>
                        </tr>
                    `;
                });
                if (activityHtml) {
                    activityBody.innerHTML = activityHtml;
                } else {
                    activityBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No recent activity</td></tr>';
                }
            }
            console.log('✅ Admin dashboard stats loaded');
        }
    } catch (error) {
        console.error('Load admin dashboard error:', error);
    }
}
async function loadAdminUsers() {
    try {
        if (typeof API !== 'undefined' && API.Token.isAdmin()) {
            const users = await API.Users.getAll();
            const tbody = document.querySelector('#usersTable tbody');
            if (users && users.length > 0) {
                const totalUsers = document.getElementById('totalUsersCount');
                const activeUsers = document.getElementById('activeUsersCount');
                const adminUsers = document.getElementById('adminUsersCount');
                const inactiveUsers = document.getElementById('inactiveUsersCount');
                if (totalUsers) totalUsers.textContent = users.length;
                if (activeUsers) activeUsers.textContent = users.filter(u => u.status === 'active').length;
                if (adminUsers) adminUsers.textContent = users.filter(u => u.role === 'admin').length;
                if (inactiveUsers) inactiveUsers.textContent = users.filter(u => u.status !== 'active').length;
                if (tbody) {
                    tbody.innerHTML = users.map((user) => `
                        <tr data-user-id="${user.user_id}">
                            <td>${user.user_id}</td>
                            <td>
                                <i class="fas fa-user-circle text-primary"></i>
                                <strong>${user.name}</strong>
                            </td>
                            <td>${user.email}</td>
                            <td>
                                <select class="form-select form-select-sm" id="role-${user.user_id}" onchange="changeUserRole(${user.user_id})">
                                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                </select>
                            </td>
                            <td>${formatDate(user.created_at)}</td>
                            <td>-</td>
                            <td>-</td>
                            <td><span class="badge bg-${user.status === 'active' ? 'success' : 'danger'}">${user.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" title="View Profile">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.user_id})" title="Delete User">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('');
                    setupDataTables();
                }
            } else {
                if (tbody) {
                    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No users found</td></tr>';
                }
            }
        }
    } catch (error) {
        console.error('Load users error:', error);
        const tbody = document.querySelector('#usersTable tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Failed to load users</td></tr>';
        }
    }
}
async function loadAdminRecipes() {
    try {
        if (typeof API !== 'undefined') {
            const recipes = await API.Recipes.getAll();
            const tbody = document.querySelector('#recipesTable tbody');
            if (recipes && recipes.length > 0) {
                const totalRecipes = document.getElementById('totalRecipesCount');
                const pendingRecipes = document.getElementById('pendingRecipesCount');
                const approvedRecipes = document.getElementById('approvedRecipesCount');
                const pending = recipes.filter(r => r.status === 'pending').length;
                const approved = recipes.filter(r => r.status === 'active').length;
                if (totalRecipes) totalRecipes.textContent = recipes.length;
                if (pendingRecipes) pendingRecipes.textContent = pending;
                if (approvedRecipes) approvedRecipes.textContent = approved;
                if (tbody) {
                    tbody.innerHTML = recipes.map(recipe => `
                        <tr data-recipe-id="${recipe.recipe_id}">
                            <td>${recipe.recipe_id}</td>
                            <td>
                                <strong>${recipe.title}</strong>
                                <br><small class="text-muted">${recipe.description ? recipe.description.substring(0, 50) + '...' : ''}</small>
                            </td>
                            <td><span class="badge bg-info">${recipe.category_name || getCategoryName(recipe.category_id)}</span></td>
                            <td>${recipe.author_name || 'User #' + recipe.user_id}</td>
                            <td>${formatDate(recipe.created_at)}</td>
                            <td><span class="badge bg-${recipe.status === 'active' ? 'success' : 'warning'}">${recipe.status}</span></td>
                            <td><span class="badge bg-${recipe.difficulty === 'easy' ? 'success' : recipe.difficulty === 'hard' ? 'danger' : 'warning'}">${recipe.difficulty || 'N/A'}</span></td>
                            <td>-</td>
                            <td>
                                ${recipe.status !== 'active' ? `<button class="btn btn-sm btn-success" onclick="approveRecipe(${recipe.recipe_id})" title="Approve"><i class="fas fa-check"></i></button>` : ''}
                                <button class="btn btn-sm btn-primary" onclick="loadRecipeDetails(${recipe.recipe_id})" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteRecipe(${recipe.recipe_id})" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('');
                    setupDataTables();
                }
            } else {
                if (tbody) {
                    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No recipes found</td></tr>';
                }
            }
        }
    } catch (error) {
        console.error('Load recipes error:', error);
        const tbody = document.querySelector('#recipesTable tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Failed to load recipes</td></tr>';
        }
    }
}
function setupDataTables() {
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('.table:visible').each(function() {
            if (!$.fn.DataTable.isDataTable(this)) {
                $(this).DataTable();
            }
        });
    }
}
window.deleteUser = async function(userId) {
    if (!isAdmin()) {
        showToast('❌ Admin access required', 'error');
        return;
    }
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    try {
        await API.Users.delete(userId);
        showToast('✅ User deleted successfully', 'success');
        document.querySelector(`tr[data-user-id="${userId}"]`)?.remove();
    } catch (error) {
        console.error('Delete user error:', error);
        showToast(`❌ ${error.message || 'Failed to delete user'}`, 'error');
    }
};
window.changeUserRole = async function(userId) {
    if (!isAdmin()) {
        showToast('❌ Admin access required', 'error');
        return;
    }
    const select = document.getElementById(`role-${userId}`);
    const newRole = select.value;
    try {
        await API.Users.update(userId, { role: newRole });
        showToast(`✅ User role changed to ${newRole}`, 'success');
    } catch (error) {
        console.error('Change role error:', error);
        showToast(`❌ ${error.message || 'Failed to change user role'}`, 'error');
        select.value = select.value === 'admin' ? 'user' : 'admin';
    }
};
window.deleteRecipe = async function(recipeId) {
    if (!isAdmin()) {
        showToast('❌ Admin access required', 'error');
        return;
    }
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
        return;
    }
    try {
        await API.Recipes.delete(recipeId);
        showToast('✅ Recipe deleted successfully', 'success');
        document.querySelector(`tr[data-recipe-id="${recipeId}"]`)?.remove();
    } catch (error) {
        console.error('Delete recipe error:', error);
        showToast(`❌ ${error.message || 'Failed to delete recipe'}`, 'error');
    }
};
window.approveRecipe = async function(recipeId) {
    if (!isAdmin()) {
        showToast('❌ Admin access required', 'error');
        return;
    }
    try {
        await API.Recipes.update(recipeId, { status: 'active' });
        showToast('✅ Recipe approved successfully', 'success');
        const row = document.querySelector(`tr[data-recipe-id="${recipeId}"]`);
        if (row) {
            const statusCell = row.querySelector('td:nth-child(6)');
            if (statusCell) {
                statusCell.innerHTML = '<span class="badge bg-success">active</span>';
            }
            row.querySelector('.btn-success')?.remove();
        }
    } catch (error) {
        console.error('Approve recipe error:', error);
        showToast(`❌ ${error.message || 'Failed to approve recipe'}`, 'error');
    }
};
function checkAuth() {
    if (typeof API !== 'undefined' && API.Token.isAuthenticated()) {
        const user = API.Token.getUser();
        currentUser = user ? user.name : null;
        userRole = user ? user.role : null;
        if (user) {
            localStorage.setItem('currentUser', user.name);
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userEmail', user.email);
        }
    } else {
        currentUser = localStorage.getItem('currentUser');
        userRole = localStorage.getItem('userRole');
    }
    updateNavigation();
}
function updateNavigation() {
    if (currentUser) {
        document.querySelectorAll('.guest-nav').forEach(el => el.classList.add('d-none'));
        document.querySelectorAll('.auth-nav').forEach(el => el.classList.remove('d-none'));
        if (userRole === 'admin') {
            document.querySelectorAll('.admin-nav').forEach(el => el.classList.remove('d-none'));
        } else {
            document.querySelectorAll('.admin-nav').forEach(el => el.classList.add('d-none'));
        }
        const usernameEl = document.getElementById('username-display');
        if (usernameEl) {
            usernameEl.textContent = currentUser;
            if (userRole === 'admin') {
                usernameEl.innerHTML = `${currentUser} <span class="badge bg-warning text-dark">Admin</span>`;
            }
        }
    } else {
        document.querySelectorAll('.guest-nav').forEach(el => el.classList.remove('d-none'));
        document.querySelectorAll('.auth-nav').forEach(el => el.classList.add('d-none'));
        document.querySelectorAll('.admin-nav').forEach(el => el.classList.add('d-none'));
    }
}
window.logout = function() {
    if (typeof API !== 'undefined') {
        API.Auth.logout();
    }
    localStorage.clear();
    currentUser = null;
    userRole = null;
    userFavorites = [];
    updateNavigation();
    showView('home');
    showToast('✅ Logged out successfully! See you soon!', 'success');
};
function setupLoginPage() {
    console.log('🔧 Setting up Login page...');
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    const newForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newForm, loginForm);
    newForm.onsubmit = async function(e) {
        e.preventDefault();
        const email = newForm.querySelector('#email').value;
        const password = newForm.querySelector('#password').value;
        const submitBtn = newForm.querySelector('button[type="submit"]');
        if (!email || !password) {
            showToast('❌ Please fill in all fields!', 'error');
            return;
        }
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        try {
            if (typeof API !== 'undefined') {
                const response = await API.Auth.login(email, password);
                if (response.user) {
                    currentUser = response.user.name;
                    userRole = response.user.role;
                    localStorage.setItem('currentUser', response.user.name);
                    localStorage.setItem('userRole', response.user.role);
                    localStorage.setItem('userEmail', response.user.email);
                    try {
                        userFavorites = await API.Favorites.getAll();
                    } catch (e) {
                        userFavorites = [];
                    }
                    checkAuth();
                    showToast(`✅ Welcome back, ${response.user.name}!`, 'success');
                    if (response.user.role === 'admin') {
                        showView('admin-dashboard');
                    } else {
                        showView('home');
                    }
                }
            } else {
                const username = email.split('@')[0];
                localStorage.setItem('currentUser', username);
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('userEmail', email);
                currentUser = username;
                userRole = 'user';
                checkAuth();
                showToast(`✅ Welcome back, ${username}! (Demo Mode)`, 'success');
                    showView('home');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast(`❌ ${error.message || 'Login failed. Please check your credentials.'}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    };
    console.log('✅ Login page ready!');
}
function setupRegisterPage() {
    console.log('🔧 Setting up Register page...');
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    const newForm = registerForm.cloneNode(true);
    registerForm.parentNode.replaceChild(newForm, registerForm);
    newForm.onsubmit = async function(e) {
        e.preventDefault();
        const name = newForm.querySelector('#name').value;
        const email = newForm.querySelector('#email').value;
        const password = newForm.querySelector('#password').value;
        const confirmPassword = newForm.querySelector('#confirmPassword').value;
        const agreeTerms = newForm.querySelector('#agreeTerms').checked;
        const submitBtn = newForm.querySelector('button[type="submit"]');
        if (!name || !email || !password || !confirmPassword) {
            showToast('❌ Please fill in all fields!', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showToast('❌ Passwords do not match!', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('❌ Password must be at least 6 characters!', 'error');
            return;
        }
        if (!agreeTerms) {
            showToast('❌ Please agree to Terms and Conditions!', 'error');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('❌ Please enter a valid email address!', 'error');
            return;
        }
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        try {
            if (typeof API !== 'undefined') {
                const response = await API.Auth.register(name, email, password);
                if (response.user) {
                    currentUser = response.user.name;
                    userRole = response.user.role;
                    localStorage.setItem('currentUser', response.user.name);
                    localStorage.setItem('userRole', response.user.role);
                    localStorage.setItem('userEmail', response.user.email);
                    checkAuth();
                    showToast(`✅ Welcome to CookMaster, ${response.user.name}! Your account has been created.`, 'success');
                    showView('home');
                }
            } else {
                localStorage.setItem('currentUser', name);
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('userEmail', email);
                currentUser = name;
                userRole = 'user';
                checkAuth();
                showToast(`✅ Welcome to CookMaster, ${name}! (Demo Mode)`, 'success');
                showView('home');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast(`❌ ${error.message || 'Registration failed. Please try again.'}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    };
    console.log('✅ Register page ready!');
}
function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show`;
    toast.style.cssText = 'min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function getCategoryName(categoryId) {
    if (!categoryId) return 'Uncategorized';
    const category = allCategories.find(c => c.cat_id == categoryId);
    return category ? category.name : 'Uncategorized';
}
function getDefaultImage(categoryId) {
    const images = {
        1: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
        2: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        3: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        4: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
        5: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400'
    };
    return images[categoryId] || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400';
}
function formatDate(dateStr) {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute(s) ago`;
    if (diffHours < 24) return `${diffHours} hour(s) ago`;
    if (diffDays < 7) return `${diffDays} day(s) ago`;
    return date.toLocaleDateString();
}
window.printRecipe = function() {
    window.print();
};
window.shareRecipe = function() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById('recipeTitle').textContent,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('📋 Link copied to clipboard!', 'success');
    }
};
window.showView = showView;
window.navigateTo = showView;
function loadViewFromHash() {
    let hash = window.location.hash.substring(1);
    if (!hash || hash === '') {
        hash = 'home';
        window.location.hash = 'home';
    }
    const targetView = document.getElementById(`view-${hash}`);
    if (targetView) {
        document.querySelectorAll('.app-view').forEach(view => {
            view.classList.remove('active');
        });
        targetView.classList.add('active');
        setupPage(hash);
    }
}
window.addEventListener('hashchange', function() {
    console.log('🔄 Hash changed to:', window.location.hash);
    loadViewFromHash();
});
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 CookMaster Starting...');
    await loadAllViews();
    checkAuth();
    loadViewFromHash();
    if (typeof API !== 'undefined') {
        try {
            allCategories = await API.Categories.getAll();
        } catch (e) {
            console.log('Categories will load on demand');
        }
    }
    console.log('✅ App Ready with full API integration!');
});
