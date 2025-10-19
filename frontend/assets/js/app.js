let currentUser = null;
let userRole = null;
let viewsLoaded = false;

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
        if (pageName === 'recipes') {
            setupRecipesPage();
        } else if (pageName === 'community') {
            setupCommunityPage();
        } else if (pageName === 'login') {
            setupLoginPage();
        } else if (pageName === 'register') {
            setupRegisterPage();
        } else if (pageName === 'submit-recipe') {
            setupSubmitRecipePage();
        } else if (pageName === 'admin-recipes' || pageName === 'admin-users') {
            setupDataTables();
        }
    }, 100);
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
        
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `Showing ${visibleCount} recipe(s)`;
        }
    };
    
    console.log('✅ Recipes page ready!');
}

window.loadRecipeDetails = function(recipeId) {
    console.log('📖 Loading recipe details:', recipeId);
    
    const recipes = {
        1: {
            title: 'Classic Margherita Pizza',
            author: 'Giovanni Rossi',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop',
            prepTime: '30 minutes',
            servings: '4 people',
            difficulty: 'Medium',
            category: 'Dinner',
            description: 'Authentic Italian pizza with fresh mozzarella, basil, and tomato sauce. A classic that never disappoints!',
            ingredients: [
                '500g pizza dough',
                '200g fresh mozzarella',
                '300g tomato sauce',
                'Fresh basil leaves',
                '2 tbsp olive oil',
                'Salt and pepper to taste'
            ],
            instructions: [
                'Preheat oven to 250°C (480°F)',
                'Roll out pizza dough to desired thickness',
                'Spread tomato sauce evenly',
                'Add sliced mozzarella',
                'Bake for 10-12 minutes until crust is golden',
                'Top with fresh basil and olive oil',
                'Serve hot and enjoy!'
            ]
        },
        2: {
            title: 'Creamy Carbonara',
            author: 'Maria Romano',
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop',
            prepTime: '25 minutes',
            servings: '4 people',
            difficulty: 'Medium',
            category: 'Dinner',
            description: 'Rich and creamy pasta with bacon, eggs, and parmesan cheese.',
            ingredients: [
                '400g spaghetti',
                '200g bacon',
                '3 eggs',
                '100g parmesan cheese',
                'Black pepper',
                'Salt'
            ],
            instructions: [
                'Cook spaghetti according to package directions',
                'Fry bacon until crispy',
                'Beat eggs with parmesan',
                'Mix hot pasta with bacon',
                'Remove from heat and stir in egg mixture',
                'Season with black pepper',
                'Serve immediately'
            ]
        },
        3: {
            title: 'Chocolate Lava Cake',
            author: 'Chef Pierre',
            image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=500&fit=crop',
            prepTime: '45 minutes',
            servings: '6 people',
            difficulty: 'Hard',
            category: 'Dessert',
            description: 'Decadent chocolate cake with a molten center.',
            ingredients: [
                '200g dark chocolate',
                '100g butter',
                '3 eggs',
                '100g sugar',
                '50g flour',
                'Vanilla extract'
            ],
            instructions: [
                'Melt chocolate and butter together',
                'Beat eggs with sugar until fluffy',
                'Fold in chocolate mixture',
                'Add flour gently',
                'Pour into greased ramekins',
                'Bake at 200°C for 12 minutes',
                'Serve warm with ice cream'
            ]
        },
        4: {
            title: 'Fresh Garden Salad',
            author: 'Chef Anna',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop',
            prepTime: '15 minutes',
            servings: '4 people',
            difficulty: 'Easy',
            category: 'Lunch',
            description: 'Crispy vegetables with homemade vinaigrette dressing.',
            ingredients: [
                'Mixed lettuce',
                'Cherry tomatoes',
                'Cucumber',
                'Red onion',
                'Olive oil',
                'Balsamic vinegar'
            ],
            instructions: [
                'Wash and dry lettuce',
                'Chop all vegetables',
                'Mix oil and vinegar',
                'Toss salad with dressing',
                'Serve immediately'
            ]
        }
    };
    
    const recipe = recipes[recipeId];
    if (!recipe) {
        console.error('Recipe not found!');
        return;
    }
    
    showView('recipe-details');
    
    setTimeout(() => {
        document.getElementById('recipeTitle').textContent = recipe.title;
        document.getElementById('recipeAuthor').textContent = recipe.author;
        document.getElementById('recipeImage').src = recipe.image;
        document.getElementById('recipePrepTime').textContent = recipe.prepTime;
        document.getElementById('recipeServings').textContent = recipe.servings;
        document.getElementById('recipeDifficulty').textContent = recipe.difficulty;
        document.getElementById('recipeCategory').textContent = recipe.category;
        document.getElementById('recipeDescription').textContent = recipe.description;
        
        const ingredientsList = document.getElementById('recipeIngredients');
        ingredientsList.innerHTML = recipe.ingredients.map(ing => 
            `<li><i class="fas fa-check text-success"></i> ${ing}</li>`
        ).join('');
        
        const instructionsList = document.getElementById('recipeInstructions');
        instructionsList.innerHTML = recipe.instructions.map(inst => 
            `<li>${inst}</li>`
        ).join('');
        
        console.log('✅ Recipe details loaded!');
    }, 200);
};

function setupCommunityPage() {
    console.log('🔧 Setting up Community page...');
    
    const postBtn = document.getElementById('communityPostBtn');
    if (postBtn) {
        postBtn.onclick = function() {
            const textarea = document.getElementById('communityNewCommentText');
            const isQuestion = document.getElementById('communityIsQuestion');
            const text = textarea.value.trim();
            
            if (!text) {
                alert('Please write something!');
                return;
            }
            
            const newComment = createCommentHTML(
                text,
                'Guest User',
                'Just now',
                0,
                isQuestion.checked
            );
            
            const commentsArea = document.getElementById('communityCommentsArea');
            commentsArea.insertAdjacentHTML('afterbegin', newComment);
            
            textarea.value = '';
            isQuestion.checked = false;
            
            updateCommentsCount();
            
            attachCommentEventListeners();
            
            alert('Comment posted! 💬');
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
    
    attachCommentEventListeners();
    
    console.log('✅ Community page ready!');
}

function createCommentHTML(text, author, time, likes, isQuestion) {
    const questionBadge = isQuestion ? '<span class="badge bg-warning">Question</span>' : '';
    const commentId = Date.now();
    const contentForSearch = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    
    return `
        <div class="col-md-12 mb-3 community-comment-item" data-likes="${likes}" data-question="${isQuestion}" data-content="${contentForSearch}">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex mb-3">
                        <i class="fas fa-user-circle fa-3x text-primary me-3"></i>
                        <div class="flex-grow-1">
                            <h6>${author} ${questionBadge}</h6>
                            <small class="text-muted">${time}</small>
                        </div>
                        <span class="badge bg-secondary"><i class="fas fa-thumbs-up"></i> <span class="community-likes-count">${likes}</span></span>
                    </div>
                    <p>${text}</p>
                    <button class="btn btn-sm btn-outline-primary community-like-btn" data-id="${commentId}">
                        <i class="fas fa-thumbs-up"></i> Like
                    </button>
                    <button class="btn btn-sm btn-outline-secondary community-reply-btn" data-id="${commentId}">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    <div class="d-none mt-2 community-reply-form" data-id="${commentId}">
                        <textarea class="form-control mb-2 community-reply-text" rows="2" placeholder="Write your reply..."></textarea>
                        <button class="btn btn-sm btn-primary community-submit-reply" data-id="${commentId}">Post</button>
                        <button class="btn btn-sm btn-secondary community-cancel-reply" data-id="${commentId}">Cancel</button>
                    </div>
                    <div class="community-replies-area" data-id="${commentId}"></div>
                </div>
            </div>
        </div>
    `;
}

function attachCommentEventListeners() {
    document.querySelectorAll('.community-like-btn').forEach(btn => {
        btn.onclick = function() {
            const commentItem = this.closest('.community-comment-item');
            const likesCountSpan = commentItem.querySelector('.community-likes-count');
            let currentLikes = parseInt(likesCountSpan.textContent);
            
            if (this.classList.contains('btn-outline-primary')) {
                currentLikes++;
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary');
            } else {
                currentLikes--;
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline-primary');
            }
            
            likesCountSpan.textContent = currentLikes;
            commentItem.setAttribute('data-likes', currentLikes);
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
        btn.onclick = function() {
            const id = this.getAttribute('data-id');
            const textarea = document.querySelector(`.community-reply-form[data-id="${id}"] .community-reply-text`);
            const repliesArea = document.querySelector(`.community-replies-area[data-id="${id}"]`);
            const text = textarea.value.trim();
            
            if (!text) {
                alert('Please write a reply!');
                return;
            }
            
            const replyHTML = `
                <div class="mt-2 ms-4 border-start border-primary border-3 ps-3">
                    <small><strong>Guest User</strong> - Just now</small>
                    <p class="mb-0">${text}</p>
                </div>
            `;
            
            repliesArea.insertAdjacentHTML('beforeend', replyHTML);
            textarea.value = '';
            
            const form = document.querySelector(`.community-reply-form[data-id="${id}"]`);
            if (form) {
                form.classList.add('d-none');
            }
            
            alert('Reply posted! 💬');
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
    console.log('📅 Sorting by recent...');
    const commentsArea = document.getElementById('communityCommentsArea');
    const comments = Array.from(commentsArea.querySelectorAll('.community-comment-item'));
    
    comments.forEach(comment => {
        comment.style.display = 'block';
    });
    
    updateCommentsCount();
}

function sortCommentsByPopular() {
    console.log('⭐ Sorting by popular...');
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
    console.log('❓ Filtering questions...');
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

function setupDataTables() {
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('.table:visible').DataTable();
    }
}

function checkAuth() {
    currentUser = localStorage.getItem('currentUser');
    userRole = localStorage.getItem('userRole');
    
    if (currentUser) {
        document.querySelectorAll('.guest-nav').forEach(el => el.classList.add('d-none'));
        document.querySelectorAll('.auth-nav').forEach(el => el.classList.remove('d-none'));
        
        if (userRole === 'admin') {
            document.querySelectorAll('.admin-nav').forEach(el => el.classList.remove('d-none'));
        }
        
        const usernameEl = document.getElementById('username-display');
        if (usernameEl) usernameEl.textContent = currentUser;
    }
}

window.logout = function() {
    localStorage.clear();
    currentUser = null;
    userRole = null;
    
    document.querySelectorAll('.guest-nav').forEach(el => el.classList.remove('d-none'));
    document.querySelectorAll('.auth-nav').forEach(el => el.classList.add('d-none'));
    document.querySelectorAll('.admin-nav').forEach(el => el.classList.add('d-none'));
    
    showView('home');
    alert('✅ Logged out successfully!');
};

function setupLoginPage() {
    console.log('🔧 Setting up Login page...');
    
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.onsubmit = function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        if (email && password) {
            const username = email.split('@')[0];
            
            localStorage.setItem('currentUser', username);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', email);
            
            currentUser = username;
            userRole = role;
            
            checkAuth();
            
            alert(`✅ Welcome back, ${username}!`);
            
            if (role === 'admin') {
                showView('admin-dashboard');
            } else {
                showView('home');
            }
        } else {
            alert('❌ Please fill in all fields!');
        }
    };
    
    console.log('✅ Login page ready!');
}

function setupRegisterPage() {
    console.log('🔧 Setting up Register page...');
    
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.onsubmit = function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        if (!name || !email || !password || !confirmPassword) {
            alert('❌ Please fill in all fields!');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('❌ Passwords do not match!');
            return;
        }
        
        if (password.length < 6) {
            alert('❌ Password must be at least 6 characters!');
            return;
        }
        
        if (!agreeTerms) {
            alert('❌ Please agree to Terms and Conditions!');
            return;
        }
        
        localStorage.setItem('currentUser', name);
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('userEmail', email);
        
        currentUser = name;
        userRole = 'user';
        
        checkAuth();
        
        alert(`✅ Welcome to CookMaster, ${name}! Your account has been created.`);
        showView('home');
    };
    
    console.log('✅ Register page ready!');
}

window.toggleFavorite = function(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        console.log('❤️ Added to favorites');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        console.log('💔 Removed from favorites');
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
    
    console.log('✅ App Ready with hash routing!');
});
