<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
        return $headers;
    }
}

class AuthMiddleware {
    public static function getToken() {
        $authHeader = null;
        
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $authHeader = $headers['authorization'];
        }
        
        if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }
        
        if (!$authHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
        
        if (!$authHeader && function_exists('apache_request_headers')) {
            $apacheHeaders = apache_request_headers();
            if (isset($apacheHeaders['Authorization'])) {
                $authHeader = $apacheHeaders['Authorization'];
            }
        }
        
        if (!$authHeader) {
            return null;
        }
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }
    public static function verifyToken($token) {
        try {
            $decoded = JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));
            return (array) $decoded;
        } catch (Exception $e) {
            return null;
        }
    }
    public static function authenticate() {
        $token = self::getToken();
        if (!$token) {
            Flight::halt(401, json_encode([
                'error' => 'Access denied. No token provided.'
            ]));
            return false;
        }
        $decoded = self::verifyToken($token);
        if (!$decoded) {
            Flight::halt(401, json_encode([
                'error' => 'Invalid or expired token.'
            ]));
            return false;
        }
        Flight::set('user', $decoded);
        return true;
    }
    public static function adminOnly() {
        if (!self::authenticate()) {
            return false;
        }
        $user = Flight::get('user');
        if (!isset($user['role']) || $user['role'] !== 'admin') {
            Flight::halt(403, json_encode([
                'error' => 'Access denied. Admin privileges required.'
            ]));
            return false;
        }
        return true;
    }
    public static function ownerOrAdmin($resourceUserId) {
        if (!self::authenticate()) {
            return false;
        }
        $user = Flight::get('user');
        if ($user['role'] === 'admin' || $user['user_id'] == $resourceUserId) {
            return true;
        }
        Flight::halt(403, json_encode([
            'error' => 'Access denied. You can only modify your own resources.'
        ]));
        return false;
    }
    public static function generateToken($user) {
        $issuedAt = time();
        $expirationTime = $issuedAt + Config::JWT_EXPIRATION();
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'user_id' => $user['user_id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role']
        ];
        return JWT::encode($payload, Config::JWT_SECRET(), 'HS256');
    }
}
