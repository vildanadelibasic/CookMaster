

const RECIPE_IMAGES = {

    pizza: {
        id: 1,
        name: 'Classic Margherita Pizza',
        thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
        large: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop',
        category: 'dinner'
    },
    
    carbonara: {
        id: 2,
        name: 'Creamy Carbonara',
        thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
        large: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop',
        category: 'dinner'
    },
    
    chocolateCake: {
        id: 3,
        name: 'Chocolate Lava Cake',
        thumbnail: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
        large: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=500&fit=crop',
        category: 'dessert'
    },
    
    salad: {
        id: 4,
        name: 'Fresh Garden Salad',
        thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        large: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop',
        category: 'lunch'
    },
    
    burger: {
        id: 5,
        name: 'Gourmet Beef Burger',
        thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
        large: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop',
        category: 'dinner'
    },
    
    buddhaBowl: {
        id: 6,
        name: 'Buddha Bowl',
        thumbnail: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
        large: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop',
        category: 'lunch'
    },
    
    sushi: {
        id: 7,
        name: 'California Roll Sushi',
        thumbnail: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop',
        large: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=500&fit=crop',
        category: 'dinner'
    },
    
    tomatoSoup: {
        id: 8,
        name: 'Creamy Tomato Soup',
        thumbnail: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
        large: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=500&fit=crop',
        category: 'lunch'
    },
    
    chicken: {
        id: 9,
        name: 'Grilled Chicken Breast',
        thumbnail: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
        large: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=500&fit=crop',
        category: 'dinner'
    }
};

const CATEGORY_IMAGES = {
    breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
    lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    dinner: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    snacks: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=300&fit=crop',
    beverages: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'
};

const PLACEHOLDER_IMAGES = {
    default: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
    noImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    cooking: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop'
};

function getRecipeImage(recipeId, size = 'thumbnail') {
    const recipes = Object.values(RECIPE_IMAGES);
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe[size] : PLACEHOLDER_IMAGES.default;
}

function getRandomRecipeImage(size = 'thumbnail') {
    const recipes = Object.values(RECIPE_IMAGES);
    const random = recipes[Math.floor(Math.random() * recipes.length)];
    return random[size];
}

function resizeImage(url, width = 400, height = 300) {
    if (url.includes('unsplash.com')) {
        const baseUrl = url.split('?')[0];
        return `${baseUrl}?w=${width}&h=${height}&fit=crop`;
    }
    return url;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RECIPE_IMAGES,
        CATEGORY_IMAGES,
        PLACEHOLDER_IMAGES,
        getRecipeImage,
        getRandomRecipeImage,
        resizeImage
    };
}

window.RecipeImages = {
    recipes: RECIPE_IMAGES,
    categories: CATEGORY_IMAGES,
    placeholders: PLACEHOLDER_IMAGES,
    getImage: getRecipeImage,
    getRandom: getRandomRecipeImage,
    resize: resizeImage
};

console.log('✅ Recipe Images library loaded!');


