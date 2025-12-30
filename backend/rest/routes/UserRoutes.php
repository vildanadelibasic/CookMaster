<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/UserService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
$userService = new UserService();
Flight::route('GET /users', function() use ($userService) {
    if (!AuthMiddleware::adminOnly()) {
        return;
    }
    $users = $userService->getAll();
    foreach ($users as &$user) {
        unset($user['password']);
    }
    echo json_encode($users);
});
Flight::route('GET /users/@id', function($id) use ($userService) {
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $currentUser = Flight::get('user');
    if ($currentUser['role'] !== 'admin' && $currentUser['user_id'] != $id) {
        Flight::halt(403, json_encode(['error' => 'Access denied. You can only view your own profile.']));
        return;
    }
    $user = $userService->getUserById($id);
    if ($user) {
        unset($user['password']);
    }
    echo json_encode($user);
});
Flight::route('POST /users', function() use ($userService) {
    if (!AuthMiddleware::adminOnly()) {
        return;
    }
    $rawData = Flight::request()->getBody();
    $data = json_decode($rawData, true);
    if (!$data) {
        $data = Flight::request()->data->getData();
    }
    try {
        $result = $userService->createUser(
            $data['name'], 
            $data['email'], 
            $data['password'], 
            $data['role'] ?? 'user', 
            $data['status'] ?? 'active'
        );
        echo json_encode(['message' => 'User created successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('PUT /users/@id', function($id) use ($userService) {
    if (!AuthMiddleware::adminOnly()) {
        return;
    }
    $rawData = Flight::request()->getBody();
    $data = json_decode($rawData, true);
    if (!$data) {
        $data = Flight::request()->data->getData();
    }
    $currentUser = $userService->getUserById($id);
    if (!$currentUser) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        return;
    }
    try {
        $result = $userService->updateUser(
            $id,
            $data['name'] ?? $currentUser['name'], 
            $data['email'] ?? $currentUser['email'], 
            isset($data['password']) && !empty($data['password']) ? $data['password'] : $currentUser['password'], 
            $data['role'] ?? $currentUser['role'], 
            $data['status'] ?? $currentUser['status']
        );
        echo json_encode(['message' => 'User updated successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('DELETE /users/@id', function($id) use ($userService) {
    if (!AuthMiddleware::adminOnly()) {
        return;
    }
    $currentUser = Flight::get('user');
    if ($currentUser['user_id'] == $id) {
        http_response_code(400);
        echo json_encode(['error' => 'You cannot delete your own account.']);
        return;
    }
    try {
        $result = $userService->deleteUser($id);
        echo json_encode(['message' => 'User deleted successfully', 'result' => $result]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});