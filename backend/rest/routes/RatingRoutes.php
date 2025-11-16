<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/RatingService.php';

$ratingService = new RatingService();

/**
 * @OA\Get(
 *     path="/ratings",
 *     tags={"Ratings"},
 *     summary="Get all ratings",
 *     @OA\Response(
 *         response=200,
 *         description="List of ratings"
 *     )
 * )
 */
Flight::route('GET /ratings', function() use ($ratingService) {
    echo json_encode($ratingService->getAllRatings());
});

/**
 * @OA\Get(
 *     path="/ratings/{id}",
 *     tags={"Ratings"},
 *     summary="Get rating by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Rating details"
 *     )
 * )
 */
Flight::route('GET /ratings/@id', function($id) use ($ratingService) {
    echo json_encode($ratingService->getRatingById($id));
});

/**
 * @OA\Post(
 *     path="/ratings",
 *     tags={"Ratings"},
 *     summary="Create a new rating",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id", "recipe_id", "rating"},
 *             @OA\Property(property="user_id", type="integer", example=1),
 *             @OA\Property(property="recipe_id", type="integer", example=1),
 *             @OA\Property(property="rating", type="integer", example=5, minimum=1, maximum=5)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Rating created successfully"
 *     )
 * )
 */
Flight::route('POST /ratings', function() use ($ratingService) {
    $data = Flight::request()->data->getData();
    echo json_encode($ratingService->addRating($data['user_id'], $data['recipe_id'], $data['rating']));
});

/**
 * @OA\Put(
 *     path="/ratings/{id}",
 *     tags={"Ratings"},
 *     summary="Update rating",
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
 *             @OA\Property(property="recipe_id", type="integer"),
 *             @OA\Property(property="rating", type="integer", minimum=1, maximum=5)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Rating updated successfully"
 *     )
 * )
 */
Flight::route('PUT /ratings/@id', function($id) use ($ratingService) {
    $data = Flight::request()->data->getData();
    echo json_encode($ratingService->updateRating($id, $data['user_id'], $data['recipe_id'], $data['rating']));
});

/**
 * @OA\Delete(
 *     path="/ratings/{id}",
 *     tags={"Ratings"},
 *     summary="Delete rating",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Rating deleted successfully"
 *     )
 * )
 */
Flight::route('DELETE /ratings/@id', function($id) use ($ratingService) {
    echo json_encode($ratingService->deleteRating($id));
});
