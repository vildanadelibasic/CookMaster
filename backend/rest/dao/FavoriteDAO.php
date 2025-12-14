<?php
require_once __DIR__ . '/BaseDAO.php';
class FavoriteDao extends BaseDao {
    public function __construct() {
        parent::__construct('favorites', 'fav_id');
    }
    public function add_favorite($user_id, $recipe_id) {
        return $this->insert([
            'user_id' => $user_id,
            'recipe_id' => $recipe_id
        ]);
    }
    public function get_all_favorites() {
        $stmt = $this->connection->prepare("
            SELECT f.fav_id as favorite_id, f.user_id, f.recipe_id,
                   r.title, r.description, r.ingredients, r.instructions,
                   r.category_id, r.prep_time, r.cook_time, r.servings, r.difficulty,
                   r.image_url, r.status, r.created_at
            FROM favorites f
            LEFT JOIN recipes r ON f.recipe_id = r.recipe_id
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function get_favorite_by_id($id) {
        return $this->getById($id);
    }
    public function update_favorite($id, $user_id, $recipe_id) {
        return $this->update($id, [
            'user_id' => $user_id,
            'recipe_id' => $recipe_id
        ]);
    }
    public function delete_favorite($id) {
        return $this->delete($id);
    }
    public function get_user_recipe_favorite($user_id, $recipe_id) {
        $stmt = $this->connection->prepare("
            SELECT * FROM favorites 
            WHERE user_id = :u AND recipe_id = :r
        ");
        $stmt->execute([
            ':u' => $user_id,
            ':r' => $recipe_id
        ]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function get_by_user($user_id) {
        $stmt = $this->connection->prepare("
            SELECT f.fav_id as favorite_id, f.user_id, f.recipe_id,
                   r.recipe_id, r.title, r.description, r.ingredients, r.instructions,
                   r.category_id, r.prep_time, r.cook_time, r.servings, r.difficulty,
                   r.image_url, r.status, r.created_at
            FROM favorites f
            LEFT JOIN recipes r ON f.recipe_id = r.recipe_id
            WHERE f.user_id = :u
        ");
        $stmt->execute([':u' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function delete_by_user_recipe($user_id, $recipe_id) {
        $stmt = $this->connection->prepare("
            DELETE FROM favorites WHERE user_id = :u AND recipe_id = :r
        ");
        return $stmt->execute([':u' => $user_id, ':r' => $recipe_id]);
    }
}
?>
