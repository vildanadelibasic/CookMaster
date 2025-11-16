<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../services/UserService.php';

$userService = new UserService();

/**
 * @OA\Get(
 *     path="/users",
 *     tags={"Users"},
 *     summary="Get all users",
 *     @OA\Response(
 *         response=200,
 *         description="List of users"
 *     )
 * )
 */
Flight::route('GET /users', function() use ($userService) {
    echo json_encode($userService->getAll());
});

/**
 * @OA\Get(
 *     path="/users/{id}",
 *     tags={"Users"},
 *     summary="Get user by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User details"
 *     )
 * )
 */
Flight::route('GET /users/@id', function($id) use ($userService) {
    echo json_encode($userService->getUserById($id));
});

/**
 * @OA\Post(
 *     path="/users",
 *     tags={"Users"},
 *     summary="Create a new user",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name", "email", "password"},
 *             @OA\Property(property="name", type="string", example="John Doe"),
 *             @OA\Property(property="email", type="string", example="john@example.com"),
 *             @OA\Property(property="password", type="string", example="password123"),
 *             @OA\Property(property="role", type="string", example="user"),
 *             @OA\Property(property="status", type="string", example="active")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User created successfully"
 *     )
 * )
 */
Flight::route('POST /users', function() use ($userService) {
    $data = Flight::request()->data->getData();
    echo json_encode($userService->createUser(
        $data['name'], 
        $data['email'], 
        $data['password'], 
        $data['role'] ?? 'user', 
        $data['status'] ?? 'active'
    ));
});

/**
 * @OA\Put(
 *     path="/users/{id}",
 *     tags={"Users"},
 *     summary="Update user",
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
 *             @OA\Property(property="email", type="string"),
 *             @OA\Property(property="password", type="string"),
 *             @OA\Property(property="role", type="string"),
 *             @OA\Property(property="status", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User updated successfully"
 *     )
 * )
 */
Flight::route('PUT /users/@id', function($id) use ($userService) {
    $data = Flight::request()->data->getData();
    echo json_encode($userService->updateUser(
        $id,
        $data['name'], 
        $data['email'], 
        $data['password'], 
        $data['role'], 
        $data['status']
    ));
});

/**
 * @OA\Delete(
 *     path="/users/{id}",
 *     tags={"Users"},
 *     summary="Delete user",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User deleted successfully"
 *     )
 * )
 */
Flight::route('DELETE /users/@id', function($id) use ($userService) {
    echo json_encode($userService->deleteUser($id));
});