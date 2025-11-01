<?php
require_once __DIR__ . '/BaseDAO.php';

class RatingDao extends BaseDao {
    public function __construct() {
        parent::__construct('ratings', 'rat_id');
    }

    public function add_rating($user_id, $recipe_id, $rating) {
        return $this->add(['user_id' => $user_id, 'recipe_id' => $recipe_id, 'rating' => $rating]);
    }

    public function get_all_ratings() {
        return $this->get_all();
    }

    public function get_rating_by_id($id) {
        $result = $this->get_by_id($id);
        return reset($result);
    }

    public function update_rating($id, $user_id, $recipe_id, $rating) {
        return $this->update(['user_id' => $user_id, 'recipe_id' => $recipe_id, 'rating' => $rating], $id);
    }

    public function delete_rating($id) {
        return $this->delete($id);
    }
}
?>
