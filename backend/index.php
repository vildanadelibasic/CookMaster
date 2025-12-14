<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/rest/config.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/rest/middleware/AuthMiddleware.php';
require_once __DIR__ . '/rest/routes/AuthRoutes.php';
require_once __DIR__ . '/rest/routes/RecipeRoutes.php';
require_once __DIR__ . '/rest/routes/UserRoutes.php';
require_once __DIR__ . '/rest/routes/RatingRoutes.php';
require_once __DIR__ . '/rest/routes/FavoriteRoutes.php';
require_once __DIR__ . '/rest/routes/CommentRoutes.php';
require_once __DIR__ . '/rest/routes/CategoryRoutes.php';
Flight::route('/', function() {
    echo json_encode([
        'message' => 'CookMaster API is running!',
        'version' => '1.0.0',
        'endpoints' => [
            'auth' => '/auth/login, /auth/register, /auth/me',
            'recipes' => '/recipes',
            'users' => '/users',
            'categories' => '/categories',
            'comments' => '/comments',
            'favorites' => '/favorites',
            'ratings' => '/ratings'
        ]
    ]);
});
Flight::start();
