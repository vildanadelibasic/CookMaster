<?php
require_once __DIR__ . '/BaseDao.php';

class CategoryDao extends BaseDao {
    public function __construct() {
        parent::__construct('categories', 'cat_id');
    }

    public function add_category($name, $description) {
        return $this->insert(['name' => $name, 'description' => $description]);
    }

    public function get_all_categories() {
        return $this->getAll();
    }

    public function get_category_by_id($id) {
        return $this->getById($id);
    }

    public function update_category($id, $name, $description) {
        return $this->update($id, ['name' => $name, 'description' => $description]);
    }

    public function delete_category($id) {
        return $this->delete($id);
    }
}
?>
