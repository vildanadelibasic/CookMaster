<?php
require_once __DIR__ . '/BaseDAO.php';

class CategoryDao extends BaseDao {
    public function __construct() {
        parent::__construct('categories', 'cat_id');
    }

    public function add_category($name, $description) {
        return $this->add(['name' => $name, 'description' => $description]);
    }

    public function get_all_categories() {
        return $this->get_all();
    }

    public function get_category_by_id($id) {
        $result = $this->get_by_id($id);
        return reset($result);
    }

    public function update_category($id, $name, $description) {
        return $this->update(['name' => $name, 'description' => $description], $id);
    }

    public function delete_category($id) {
        return $this->delete($id);
    }
}
?>
