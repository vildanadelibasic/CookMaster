<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/CommentService.php';

$commentService = new CommentService();

/**
 * @OA\Get(
 *     path="/comments",
 *     tags={"Comments"},
 *     summary="Get all comments",
 *     @OA\Response(
 *         response=200,
 *         description="List of comments"
 *     )
 * )
 */
Flight::route('GET /comments', function() use ($commentService) {
    echo json_encode($commentService->getAllComments());
});

/**
 * @OA\Get(
 *     path="/comments/{id}",
 *     tags={"Comments"},
 *     summary="Get comment by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Comment details"
 *     )
 * )
 */
Flight::route('GET /comments/@id', function($id) use ($commentService) {
    echo json_encode($commentService->getCommentById($id));
});

/**
 * @OA\Post(
 *     path="/comments",
 *     tags={"Comments"},
 *     summary="Create a new comment",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id", "recipe_id", "content"},
 *             @OA\Property(property="user_id", type="integer", example=1),
 *             @OA\Property(property="recipe_id", type="integer", example=1),
 *             @OA\Property(property="content", type="string", example="Great recipe!"),
 *             @OA\Property(property="parent_id", type="integer", nullable=null),
 *             @OA\Property(property="is_question", type="integer", example=0)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Comment created successfully"
 *     )
 * )
 */
Flight::route('POST /comments', function() use ($commentService) {
    $data = Flight::request()->data->getData();
    echo json_encode($commentService->addComment($data['user_id'], $data['recipe_id'], $data['content'], $data['parent_id'], $data['is_question']));
});

/**
 * @OA\Put(
 *     path="/comments/{id}",
 *     tags={"Comments"},
 *     summary="Update comment",
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
 *             @OA\Property(property="content", type="string"),
 *             @OA\Property(property="parent_id", type="integer"),
 *             @OA\Property(property="is_question", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Comment updated successfully"
 *     )
 * )
 */
Flight::route('PUT /comments/@id', function($id) use ($commentService) {
    $data = Flight::request()->data->getData();
    echo json_encode($commentService->updateComment($id, $data['user_id'], $data['recipe_id'], $data['content'], $data['parent_id'], $data['is_question']));
});

/**
 * @OA\Delete(
 *     path="/comments/{id}",
 *     tags={"Comments"},
 *     summary="Delete comment",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Comment deleted successfully"
 *     )
 * )
 */
Flight::route('DELETE /comments/@id', function($id) use ($commentService) {
    echo json_encode($commentService->deleteComment($id));
});