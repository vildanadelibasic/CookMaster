<?php
class Database {
    private static $host = "localhost";
    private static $db_name = "cook_master";
    private static $username = "root";
    private static $password = "";

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
            die("Greška u konekciji: " . $e->getMessage());
        }
    }
}
?>
