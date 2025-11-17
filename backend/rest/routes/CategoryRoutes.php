<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/CategoryService.php';

$categoryService = new CategoryService();

/**
 * @OA\Get(
 *     path="/categories",
 *     tags={"Categories"},
 *     summary="Get all categories",
 *     @OA\Response(
 *         response=200,
 *         description="List of categories"
 *     )
 * )
 */
Flight::route('GET /categories', function() use ($categoryService) {
    echo json_encode($categoryService->getAll());
});

/**
 * @OA\Get(
 *     path="/categories/{id}",
 *     tags={"Categories"},
 *     summary="Get category by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Category details"
 *     )
 * )
 */
Flight::route('GET /categories/@id', function($id) use ($categoryService) {
    echo json_encode($categoryService->getById($id));
});

/**
 * @OA\Post(
 *     path="/categories",
 *     tags={"Categories"},
 *     summary="Create a new category",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name"},
 *             @OA\Property(property="name", type="string", example="Desserts"),
 *             @OA\Property(property="description", type="string", example="Sweet treats and desserts")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Category created successfully"
 *     )
 * )
 */
Flight::route('POST /categories', function() use ($categoryService) {
    $data = Flight::request()->data->getData();
    echo json_encode($categoryService->addCategory($data));
});

/**
 * @OA\Put(
 *     path="/categories/{id}",
 *     tags={"Categories"},
 *     summary="Update category",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="description", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Category updated successfully"
 *     )
 * )
 */
Flight::route('PUT /categories/@id', function($id) use ($categoryService) {
    $data = Flight::request()->data->getData();
    echo json_encode($categoryService->updateCategory($id, $data));
});

/**
 * @OA\Delete(
 *     path="/categories/{id}",
 *     tags={"Categories"},
 *     summary="Delete category",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Category deleted successfully"
 *     )
 * )
 */
Flight::route('DELETE /categories/@id', function($id) use ($categoryService) {
    echo json_encode($categoryService->deleteCategory($id));
});