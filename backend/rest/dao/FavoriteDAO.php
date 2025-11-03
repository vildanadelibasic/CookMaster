<?php
require_once __DIR__ . '/BaseDAO.php';

class FavoriteDao extends BaseDao {
    public function __construct() {
        parent::__construct('favorites', 'fav_id');
    }

    public function add_favorite($user_id, $recipe_id) {
        return $this->add(['user_id' => $user_id, 'recipe_id' => $recipe_id]);
    }

    public function get_all_favorites() {
        return $this->get_all();
    }

    public function get_favorite_by_id($id) {
        $result = $this->get_by_id($id);
        return reset($result);
    }

    public function update_favorite($id, $user_id, $recipe_id) {
        return $this->update(['user_id' => $user_id, 'recipe_id' => $recipe_id], $id);
    }

    public function delete_favorite($id) {
        return $this->delete($id);
    }
}
?>
