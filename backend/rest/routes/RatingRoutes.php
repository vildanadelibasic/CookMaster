<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/RatingService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
$ratingService = new RatingService();
Flight::route('GET /ratings', function() use ($ratingService) {
    echo json_encode($ratingService->getAllRatings());
});
Flight::route('GET /ratings/recipe/@recipeId', function($recipeId) use ($ratingService) {
    $ratings = $ratingService->getRatingsByRecipeId($recipeId);
    $average = $ratingService->getAverageRating($recipeId);
    echo json_encode([
        'ratings' => $ratings,
        'average' => $average,
        'count' => count($ratings)
    ]);
});
Flight::route('GET /ratings/@id', function($id) use ($ratingService) {
    echo json_encode($ratingService->getRatingById($id));
});
Flight::route('POST /ratings', function() use ($ratingService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $rawData = Flight::request()->getBody();
    $data = json_decode($rawData, true);
    if (!$data) {
        $data = Flight::request()->data->getData();
    }
    if (empty($data['recipe_id']) || !isset($data['rating'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Recipe ID and rating are required']);
        return;
    }
    $rating = intval($data['rating']);
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Rating must be between 1 and 5']);
        return;
    }
    try {
        $result = $ratingService->addRating($user['user_id'], $data['recipe_id'], $rating);
        echo json_encode(['message' => 'Rating created successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('PUT /ratings/@id', function($id) use ($ratingService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $ratingRecord = $ratingService->getRatingById($id);
    if (!$ratingRecord) {
        http_response_code(404);
        echo json_encode(['error' => 'Rating not found']);
        return;
    }
    if ($user['role'] !== 'admin' && $ratingRecord['user_id'] != $user['user_id']) {
        Flight::halt(403, json_encode(['error' => 'Access denied. You can only edit your own ratings.']));
        return;
    }
    $rawData = Flight::request()->getBody();
    $data = json_decode($rawData, true);
    if (!$data) {
        $data = Flight::request()->data->getData();
    }
    if (!isset($data['rating'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Rating value is required']);
        return;
    }
    $rating = intval($data['rating']);
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Rating must be between 1 and 5']);
        return;
    }
    try {
        $result = $ratingService->updateRating(
            $id, 
            $ratingRecord['user_id'], 
            $ratingRecord['recipe_id'], 
            $rating
        );
        echo json_encode(['message' => 'Rating updated successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('DELETE /ratings/@id', function($id) use ($ratingService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $ratingRecord = $ratingService->getRatingById($id);
    if (!$ratingRecord) {
        http_response_code(404);
        echo json_encode(['error' => 'Rating not found']);
        return;
    }
    if ($user['role'] !== 'admin' && $ratingRecord['user_id'] != $user['user_id']) {
        Flight::halt(403, json_encode(['error' => 'Access denied. You can only delete your own ratings.']));
        return;
    }
    try {
        $result = $ratingService->deleteRating($id);
        echo json_encode(['message' => 'Rating deleted successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
