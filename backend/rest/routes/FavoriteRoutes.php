<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/FavoriteService.php';

$favoriteService = new FavoriteService();

/**
 * @OA\Get(
 *     path="/favorites",
 *     tags={"Favorites"},
 *     summary="Get all favorites",
 *     @OA\Response(
 *         response=200,
 *         description="List of favorites"
 *     )
 * )
 */
Flight::route('GET /favorites', function() use ($favoriteService) {
    echo json_encode($favoriteService->getAllFavorites());
});

/**
 * @OA\Get(
 *     path="/favorites/{id}",
 *     tags={"Favorites"},
 *     summary="Get favorite by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Favorite details"
 *     )
 * )
 */
Flight::route('GET /favorites/@id', function($id) use ($favoriteService) {
    echo json_encode($favoriteService->getFavoriteById($id));
});

/**
 * @OA\Post(
 *     path="/favorites",
 *     tags={"Favorites"},
 *     summary="Add a recipe to favorites",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id", "recipe_id"},
 *             @OA\Property(property="user_id", type="integer", example=1),
 *             @OA\Property(property="recipe_id", type="integer", example=1)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Recipe added to favorites successfully"
 *     )
 * )
 */
Flight::route('POST /favorites', function() use ($favoriteService) {
    $data = Flight::request()->data->getData();
    echo json_encode($favoriteService->addFavorite($data['user_id'], $data['recipe_id']));
});

/**
 * @OA\Put(
 *     path="/favorites/{id}",
 *     tags={"Favorites"},
 *     summary="Update favorite",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="user_id", type="integer"),
 *             @OA\Property(property="recipe_id", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Favorite updated successfully"
 *     )
 * )
 */
Flight::route('PUT /favorites/@id', function($id) use ($favoriteService) {
    $data = Flight::request()->data->getData();
    echo json_encode($favoriteService->updateFavorite($id, $data['user_id'], $data['recipe_id']));
});

/**
 * @OA\Delete(
 *     path="/favorites/{id}",
 *     tags={"Favorites"},
 *     summary="Remove recipe from favorites",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Recipe removed from favorites successfully"
 *     )
 * )
 */
Flight::route('DELETE /favorites/@id', function($id) use ($favoriteService) {
    echo json_encode($favoriteService->deleteFavorite($id));
});