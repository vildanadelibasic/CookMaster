<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/rest/config.php';

require_once __DIR__ . '/rest/routes/RecipeRoutes.php';
require_once __DIR__ . '/rest/routes/UserRoutes.php';
require_once __DIR__ . '/rest/routes/RatingRoutes.php';
require_once __DIR__ . '/rest/routes/FavoriteRoutes.php';
require_once __DIR__ . '/rest/routes/CommentRoutes.php';
require_once __DIR__ . '/rest/routes/CategoryRoutes.php';

Flight::route('/', function() {
    echo 'CookMaster API is running!';
});

Flight::start();
