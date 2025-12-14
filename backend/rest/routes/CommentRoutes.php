<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/CommentService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
$commentService = new CommentService();
Flight::route('GET /comments', function() use ($commentService) {
    echo json_encode($commentService->getAllComments());
});
Flight::route('GET /comments/recipe/@recipeId', function($recipeId) use ($commentService) {
    echo json_encode($commentService->getCommentsByRecipeId($recipeId));
});
Flight::route('GET /comments/@id', function($id) use ($commentService) {
    echo json_encode($commentService->getCommentById($id));
});
Flight::route('POST /comments', function() use ($commentService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $data = Flight::request()->data->getData();
    if (empty($data['recipe_id']) || empty($data['content'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Recipe ID and content are required']);
        return;
    }
    try {
        $result = $commentService->addComment(
            $user['user_id'], 
            $data['recipe_id'], 
            $data['content'], 
            $data['parent_id'] ?? null, 
            $data['is_question'] ?? 0
        );
        echo json_encode(['message' => 'Comment created successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('PUT /comments/@id', function($id) use ($commentService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $comment = $commentService->getCommentById($id);
    if (!$comment) {
        http_response_code(404);
        echo json_encode(['error' => 'Comment not found']);
        return;
    }
    if ($user['role'] !== 'admin' && $comment['user_id'] != $user['user_id']) {
        Flight::halt(403, json_encode(['error' => 'Access denied. You can only edit your own comments.']));
        return;
    }
    $data = Flight::request()->data->getData();
    try {
        $result = $commentService->updateComment(
            $id, 
            $comment['user_id'], 
            $comment['recipe_id'], 
            $data['content'] ?? $comment['content'], 
            $comment['parent_id'], 
            $data['is_question'] ?? $comment['is_question']
        );
        echo json_encode(['message' => 'Comment updated successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('DELETE /comments/@id', function($id) use ($commentService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $user = Flight::get('user');
    $comment = $commentService->getCommentById($id);
    if (!$comment) {
        http_response_code(404);
        echo json_encode(['error' => 'Comment not found']);
        return;
    }
    if ($user['role'] !== 'admin' && $comment['user_id'] != $user['user_id']) {
        Flight::halt(403, json_encode(['error' => 'Access denied. You can only delete your own comments.']));
        return;
    }
    try {
        $result = $commentService->deleteComment($id);
        echo json_encode(['message' => 'Comment deleted successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
