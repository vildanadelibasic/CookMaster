<?php


require_once __DIR__ . '/rest/config.php';

header('Content-Type: application/json');

try {
    $conn = Database::connect();
    
    $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $userPassword = password_hash('user123', PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => 'admin@cookmaster.com']);
    $existingAdmin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$existingAdmin) {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, status) VALUES (:name, :email, :password, :role, :status)");
        $stmt->execute([
            'name' => 'Admin',
            'email' => 'admin@cookmaster.com',
            'password' => $adminPassword,
            'role' => 'admin',
            'status' => 'active'
        ]);
        echo json_encode(['message' => 'Admin user created successfully', 'email' => 'admin@cookmaster.com', 'password' => 'admin123']) . "\n";
    } else {
        $stmt = $conn->prepare("UPDATE users SET password = :password WHERE email = :email");
        $stmt->execute(['password' => $adminPassword, 'email' => 'admin@cookmaster.com']);
        echo json_encode(['message' => 'Admin user password updated', 'email' => 'admin@cookmaster.com', 'password' => 'admin123']) . "\n";
    }
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => 'user@cookmaster.com']);
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$existingUser) {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, status) VALUES (:name, :email, :password, :role, :status)");
        $stmt->execute([
            'name' => 'Test User',
            'email' => 'user@cookmaster.com',
            'password' => $userPassword,
            'role' => 'user',
            'status' => 'active'
        ]);
        echo json_encode(['message' => 'Test user created successfully', 'email' => 'user@cookmaster.com', 'password' => 'user123']) . "\n";
    } else {
        $stmt = $conn->prepare("UPDATE users SET password = :password WHERE email = :email");
        $stmt->execute(['password' => $userPassword, 'email' => 'user@cookmaster.com']);
        echo json_encode(['message' => 'Test user password updated', 'email' => 'user@cookmaster.com', 'password' => 'user123']) . "\n";
    }
    
    $categories = [
        ['name' => 'Breakfast', 'description' => 'Start your day right with delicious breakfast recipes'],
        ['name' => 'Lunch', 'description' => 'Quick and satisfying midday meals'],
        ['name' => 'Dinner', 'description' => 'Hearty dinner recipes for the whole family'],
        ['name' => 'Dessert', 'description' => 'Sweet treats and indulgent desserts'],
        ['name' => 'Snacks', 'description' => 'Quick bites and appetizers']
    ];
    
    foreach ($categories as $cat) {
        $stmt = $conn->prepare("SELECT * FROM categories WHERE name = :name");
        $stmt->execute(['name' => $cat['name']]);
        if (!$stmt->fetch()) {
            $stmt = $conn->prepare("INSERT INTO categories (name, description) VALUES (:name, :description)");
            $stmt->execute($cat);
        }
    }
    
    echo json_encode(['message' => 'Categories seeded successfully']) . "\n";
    
    echo "\n\n=== SETUP COMPLETE ===\n";
    echo "You can now login with:\n";
    echo "Admin: admin@cookmaster.com / admin123\n";
    echo "User:  user@cookmaster.com / user123\n";
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>

