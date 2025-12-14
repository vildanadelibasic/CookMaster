<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/RecipeService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
$recipeService = new RecipeService();
Flight::route('GET /recipes', function() use ($recipeService) {
    echo json_encode($recipeService->getAllRecipes());
});
Flight::route('GET /recipes/@id', function($id) use ($recipeService) {
    echo json_encode($recipeService->getRecipeById($id));
});
Flight::route('POST /recipes', function() use ($recipeService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $data = Flight::request()->data->getData();
    $data['user_id'] = $user['user_id'];
    try {
        $result = $recipeService->createRecipe($data); 
        echo json_encode(['message' => 'Recipe created successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('PUT /recipes/@id', function($id) use ($recipeService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $recipe = $recipeService->getRecipeById($id);
    if (!$recipe) {
        http_response_code(404);
        echo json_encode(['error' => 'Recipe not found']);
        return;
    }
    if ($user['role'] !== 'admin' && $recipe['user_id'] != $user['user_id']) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied. You can only edit your own recipes.']);
        return;
    }
    $data = Flight::request()->data->getData();
    try {
        $result = $recipeService->updateRecipe($id, $data);
        echo json_encode(['message' => 'Recipe updated successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('DELETE /recipes/@id', function($id) use ($recipeService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $recipe = $recipeService->getRecipeById($id);
    if (!$recipe) {
        http_response_code(404);
        echo json_encode(['error' => 'Recipe not found']);
        return;
    }
    if ($user['role'] !== 'admin' && $recipe['user_id'] != $user['user_id']) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied. You can only delete your own recipes.']);
        return;
    }
    try {
        $result = $recipeService->deleteRecipe($id);
        echo json_encode(['message' => 'Recipe deleted successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
?>