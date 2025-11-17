<?php
require_once __DIR__ . '/BaseDao.php';

class RecipeDao extends BaseDao {
    public function __construct() {
        parent::__construct('recipes', 'recipe_id');
    }

    public function add_recipe($data) {
        return $this->insert([
            'user_id' => $data['user_id'],
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'description' => $data['description'],
            'ingredients' => $data['ingredients'],
            'instructions' => $data['instructions'],
            'prep_time' => $data['prep_time'],        
            'cook_time' => $data['cook_time'],
            'servings' => $data['servings'],
            'difficulty' => $data['difficulty'],      
            'status' => $data['status'] ?? 'active'
        ]);
    }

    public function get_all_recipes() {
        return $this->getAll();
    }

    public function get_recipe_by_id($id) {
        return $this->getById($id);
    }

    public function update_recipe($id, $data) {
        return $this->update($id, [
            'user_id' => $data['user_id'],
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'description' => $data['description'],
            'ingredients' => $data['ingredients'],
            'instructions' => $data['instructions'],
            'prep_time' => $data['prep_time'],       
            'cook_time' => $data['cook_time'],
            'servings' => $data['servings'],
            'difficulty' => $data['difficulty'],      
            'status' => $data['status'] ?? 'active'
        ]);
    }

    public function delete_recipe($id) {
        return $this->delete($id);
    }
}
?>
