<?php
require_once __DIR__ . '/BaseDao.php';
class RecipeDao extends BaseDao {
    public function __construct() {
        parent::__construct('recipes', 'recipe_id');
    }
    public function add_recipe($data) {
        return $this->insert([
            'user_id' => $data['user_id'],
            'category_id' => $data['category_id'] ?? null,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'ingredients' => $data['ingredients'] ?? '',
            'instructions' => $data['instructions'],
            'prep_time' => $data['prep_time'] ?? null,        
            'cook_time' => $data['cook_time'] ?? null,
            'servings' => $data['servings'] ?? null,
            'difficulty' => $data['difficulty'] ?? 'medium',
            'image_url' => $data['image_url'] ?? null,
            'status' => $data['status'] ?? 'active'
        ]);
    }
    public function get_all_recipes() {
        $stmt = $this->connection->prepare("
            SELECT r.*, u.name as author_name, c.name as category_name
            FROM recipes r
            LEFT JOIN users u ON r.user_id = u.user_id
            LEFT JOIN categories c ON r.category_id = c.cat_id
            ORDER BY r.created_at DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function get_recipe_by_id($id) {
        $stmt = $this->connection->prepare("
            SELECT r.*, u.name as author_name, c.name as category_name
            FROM recipes r
            LEFT JOIN users u ON r.user_id = u.user_id
            LEFT JOIN categories c ON r.category_id = c.cat_id
            WHERE r.recipe_id = :id
        ");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function update_recipe($id, $data) {
        $updateData = [];
        if (isset($data['title'])) $updateData['title'] = $data['title'];
        if (isset($data['description'])) $updateData['description'] = $data['description'];
        if (isset($data['ingredients'])) $updateData['ingredients'] = $data['ingredients'];
        if (isset($data['instructions'])) $updateData['instructions'] = $data['instructions'];
        if (isset($data['category_id'])) $updateData['category_id'] = $data['category_id'];
        if (isset($data['prep_time'])) $updateData['prep_time'] = $data['prep_time'];
        if (isset($data['cook_time'])) $updateData['cook_time'] = $data['cook_time'];
        if (isset($data['servings'])) $updateData['servings'] = $data['servings'];
        if (isset($data['difficulty'])) $updateData['difficulty'] = $data['difficulty'];
        if (isset($data['image_url'])) $updateData['image_url'] = $data['image_url'];
        if (isset($data['status'])) $updateData['status'] = $data['status'];
        if (empty($updateData)) {
            return false;
        }
        return $this->update($id, $updateData);
    }
    public function delete_recipe($id) {
        return $this->delete($id);
    }
}
?>
