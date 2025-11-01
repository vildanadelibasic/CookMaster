<?php
require_once __DIR__ . '/BaseDAO.php';

class RecipeDao extends BaseDao {
    public function __construct() {
        parent::__construct('recipes', 'recipe_id');
    }

    public function add_recipe($data) {
        return $this->add($data);
    }

    public function get_all_recipes() {
        return $this->get_all();
    }

    public function get_recipe_by_id($id) {
        $result = $this->get_by_id($id);
        return reset($result);
    }

    public function update_recipe($id, $data) {
        return $this->update($data, $id);
    }

    public function delete_recipe($id) {
        return $this->delete($id);
    }
}
?>
