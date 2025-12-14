<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/CategoryService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
$categoryService = new CategoryService();
Flight::route('GET /categories', function() use ($categoryService) {
    echo json_encode($categoryService->getAll());
});
Flight::route('GET /categories/@id', function($id) use ($categoryService) {
    echo json_encode($categoryService->getById($id));
});
Flight::route('POST /categories', function() use ($categoryService) {
    if (!AuthMiddleware::adminOnly()) {
        return;
    }
    $data = Flight::request()->data->getData();
    if (empty($data['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Category name is required']);
        return;
    }
    try {
        $result = $categoryService->addCategory($data);
        echo json_encode(['message' => 'Category created successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('PUT /categories/@id', function($id) use ($categoryService) {
    if (!AuthMiddleware::adminOnly()) {
        return;
    }
    $data = Flight::request()->data->getData();
    try {
        $result = $categoryService->updateCategory($id, $data);
        echo json_encode(['message' => 'Category updated successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('DELETE /categories/@id', function($id) use ($categoryService) {
    if (!AuthMiddleware::adminOnly()) {
        return;
    }
    try {
        $result = $categoryService->deleteCategory($id);
        echo json_encode(['message' => 'Category deleted successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
