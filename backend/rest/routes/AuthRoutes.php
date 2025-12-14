<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/UserService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
$userService = new UserService();
Flight::route('POST /auth/register', function() use ($userService) {
    header('Content-Type: application/json');
    $data = Flight::request()->data->getData();
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email and password are required.']);
        return;
    }
    $existingUser = $userService->getUserByEmail($data['email']);
    if ($existingUser) {
        http_response_code(400);
        echo json_encode(['error' => 'Email already registered.']);
        return;
    }
    try {
        $result = $userService->createUser(
            $data['name'],
            $data['email'],
            $data['password'],
            'user',
            'active'
        );
        $user = $userService->getUserByEmail($data['email']);
        $token = AuthMiddleware::generateToken($user);
        unset($user['password']);
        echo json_encode([
            'message' => 'Registration successful',
            'token' => $token,
            'user' => $user
        ]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('POST /auth/login', function() use ($userService) {
    header('Content-Type: application/json');
    $data = Flight::request()->data->getData();
    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required.']);
        return;
    }
    try {
        $user = $userService->login($data['email'], $data['password']);
        if ($user['status'] !== 'active') {
            http_response_code(401);
            echo json_encode(['error' => 'Your account is not active. Please contact support.']);
            return;
        }
        $token = AuthMiddleware::generateToken($user);
        unset($user['password']);
        echo json_encode([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
Flight::route('GET /auth/me', function() use ($userService) {
    header('Content-Type: application/json');
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $tokenUser = Flight::get('user');
    $user = $userService->getUserById($tokenUser['user_id']);
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found.']);
        return;
    }
    unset($user['password']);
    echo json_encode([
        'user' => $user
    ]);
});
Flight::route('PUT /auth/profile', function() use ($userService) {
    header('Content-Type: application/json');
    if (!AuthMiddleware::authenticate()) {
        return;
    }
    $tokenUser = Flight::get('user');
    $data = Flight::request()->data->getData();
    try {
        $currentUser = $userService->getUserById($tokenUser['user_id']);
        $name = isset($data['name']) ? $data['name'] : $currentUser['name'];
        $email = isset($data['email']) ? $data['email'] : $currentUser['email'];
        $password = isset($data['password']) && !empty($data['password']) ? $data['password'] : $currentUser['password'];
        if ($email !== $currentUser['email']) {
            $existingUser = $userService->getUserByEmail($email);
            if ($existingUser && $existingUser['user_id'] != $tokenUser['user_id']) {
                http_response_code(400);
                echo json_encode(['error' => 'Email already in use by another account.']);
                return;
            }
        }
        $result = $userService->updateUser(
            $tokenUser['user_id'],
            $name,
            $email,
            $password,
            $currentUser['role'],
            $currentUser['status']
        );
        $updatedUser = $userService->getUserById($tokenUser['user_id']);
        unset($updatedUser['password']);
        $newToken = AuthMiddleware::generateToken($updatedUser);
        echo json_encode([
            'message' => 'Profile updated successfully',
            'token' => $newToken,
            'user' => $updatedUser
        ]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
});
?>
