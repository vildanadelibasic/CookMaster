<?php

class Database {
    private static $host = "localhost"; 
    private static $db_name = "cook_master";
    private static $username = "your_username"; 
    private static $password = "your_password"; 
    
    public static function connect() {
        try {
            $conn = new PDO(
                "mysql:host=" . self::$host . ";dbname=" . self::$db_name . ";charset=utf8mb4",
                self::$username,
                self::$password
            );
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed']));
        }
    }
}

class Config {
    private static $jwt_secret = "your_secret_key";
    private static $jwt_expiration = 86400;
    
    public static function JWT_SECRET() {
        return self::$jwt_secret;
    }
    
    public static function JWT_EXPIRATION() {
        return self::$jwt_expiration;
    }
}
