<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/FavoriteService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
$favoriteService = new FavoriteService();
Flight::route('GET /favorites', function() use ($favoriteService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    if ($user['role'] === 'admin') {
        echo json_encode($favoriteService->getAllFavorites());
    } else {
        echo json_encode($favoriteService->getFavoritesByUserId($user['user_id']));
    }
});
Flight::route('GET /favorites/user/@userId', function($userId) use ($favoriteService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    if ($user['role'] !== 'admin' && $user['user_id'] != $userId) {
        Flight::halt(403, json_encode(['error' => 'Access denied. You can only view your own favorites.']));
        return;
    }
    echo json_encode($favoriteService->getFavoritesByUserId($userId));
});
Flight::route('GET /favorites/@id', function($id) use ($favoriteService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $favorite = $favoriteService->getFavoriteById($id);
    if (!$favorite) {
        http_response_code(404);
        echo json_encode(['error' => 'Favorite not found']);
        return;
    }
    $user = Flight::get('user');
    if ($user['role'] !== 'admin' && $favorite['user_id'] != $user['user_id']) {
        Flight::halt(403, json_encode(['error' => 'Access denied.']));
        return;
    }
    echo json_encode($favorite);
});
Flight::route('POST /favorites', function() use ($favoriteService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $data = Flight::request()->data->getData();
    if (empty($data['recipe_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Recipe ID is required']);
        return;
    }
    try {
        $result = $favoriteService->addFavorite($user['user_id'], $data['recipe_id']);
        echo json_encode(['message' => 'Recipe added to favorites', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('DELETE /favorites/@id', function($id) use ($favoriteService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $favorite = $favoriteService->getFavoriteById($id);
    if (!$favorite) {
        http_response_code(404);
        echo json_encode(['error' => 'Favorite not found']);
        return;
    }
    if ($user['role'] !== 'admin' && $favorite['user_id'] != $user['user_id']) {
        Flight::halt(403, json_encode(['error' => 'Access denied. You can only remove your own favorites.']));
        return;
    }
    try {
        $result = $favoriteService->deleteFavorite($id);
        echo json_encode(['message' => 'Recipe removed from favorites', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('DELETE /favorites/recipe/@recipeId', function($recipeId) use ($favoriteService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    try {
        $result = $favoriteService->deleteFavoriteByUserAndRecipe($user['user_id'], $recipeId);
        echo json_encode(['message' => 'Recipe removed from favorites', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
