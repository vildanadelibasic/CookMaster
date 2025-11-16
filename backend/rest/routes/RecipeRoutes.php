<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/RecipeService.php';

$recipeService = new RecipeService();

/**
 * @OA\Get(
 *     path="/recipes",
 *     tags={"Recipes"},
 *     summary="Get all recipes",
 *     @OA\Response(
 *         response=200,
 *         description="List of recipes"
 *     )
 * )
 */
Flight::route('GET /recipes', function() use ($recipeService) {
    echo json_encode($recipeService->getAllRecipes());
});

/**
 * @OA\Get(
 *     path="/recipes/{id}",
 *     tags={"Recipes"},
 *     summary="Get recipe by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Recipe details"
 *     )
 * )
 */
Flight::route('GET /recipes/@id', function($id) use ($recipeService) {
    echo json_encode($recipeService->getRecipeById($id));
});

/**
 * @OA\Post(
 *     path="/recipes",
 *     tags={"Recipes"},
 *     summary="Create a new recipe",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"title", "ingredients", "instructions", "user_id"},
 *             @OA\Property(property="title", type="string", example="Chocolate Cake"),
 *             @OA\Property(property="ingredients", type="string", example="Flour, Sugar, Cocoa"),
 *             @OA\Property(property="instructions", type="string", example="Mix and bake at 180C"),
 *             @OA\Property(property="user_id", type="integer", example=1),
 *             @OA\Property(property="category_id", type="integer", example=1),
 *             @OA\Property(property="prep_time", type="integer", example=30),
 *             @OA\Property(property="cook_time", type="integer", example=45),
 *             @OA\Property(property="servings", type="integer", example=8),
 *             @OA\Property(property="difficulty", type="string", example="medium"),
 *             @OA\Property(property="image_url", type="string", example="https://example.com/image.jpg")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Recipe created successfully"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad request"
 *     )
 * )
 */
Flight::route('POST /recipes', function() use ($recipeService) {
    $data = Flight::request()->data->getData();
    try {
        $result = $recipeService->createRecipe($data); 
        echo json_encode($result);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});

/**
 * @OA\Put(
 *     path="/recipes/{id}",
 *     tags={"Recipes"},
 *     summary="Update recipe",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="title", type="string"),
 *             @OA\Property(property="ingredients", type="string"),
 *             @OA\Property(property="instructions", type="string"),
 *             @OA\Property(property="category_id", type="integer"),
 *             @OA\Property(property="prep_time", type="integer"),
 *             @OA\Property(property="cook_time", type="integer"),
 *             @OA\Property(property="servings", type="integer"),
 *             @OA\Property(property="difficulty", type="string"),
 *             @OA\Property(property="image_url", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Recipe updated successfully"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad request"
 *     )
 * )
 */
Flight::route('PUT /recipes/@id', function($id) use ($recipeService) {
    $data = Flight::request()->data->getData();
    try {
        $result = $recipeService->updateRecipe($id, $data);
        echo json_encode($result);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});

/**
 * @OA\Delete(
 *     path="/recipes/{id}",
 *     tags={"Recipes"},
 *     summary="Delete recipe",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Recipe deleted successfully"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad request"
 *     )
 * )
 */
Flight::route('DELETE /recipes/@id', function($id) use ($recipeService) {
    try {
        $result = $recipeService->deleteRecipe($id);
        echo json_encode($result);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
?>