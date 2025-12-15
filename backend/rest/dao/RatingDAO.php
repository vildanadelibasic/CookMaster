<?php
require_once __DIR__ . '/BaseDao.php';
class RatingDao extends BaseDao {
    public function __construct() {
        parent::__construct('ratings', 'rat_id');
    }
    public function add_rating($user_id, $recipe_id, $rating) {
        return $this->insert([
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'rating' => $rating
        ]);
    }
    public function get_all_ratings() {
        return $this->getAll();
    }
    public function get_rating_by_id($id) {
        return $this->getById($id);
    }
    public function update_rating($id, $user_id, $recipe_id, $rating) {
        return $this->update($id, [
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'rating' => $rating
        ]);
    }
    public function delete_rating($id) {
        return $this->delete($id);
    }
    public function get_user_recipe_rating($user_id, $recipe_id) {
        $stmt = $this->connection->prepare("
            SELECT * FROM ratings 
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
            SELECT * FROM ratings WHERE user_id = :u
        ");
        $stmt->execute([':u' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function get_by_recipe($recipe_id) {
        $stmt = $this->connection->prepare("
            SELECT r.*, u.name as user_name 
            FROM ratings r
            LEFT JOIN users u ON r.user_id = u.user_id
            WHERE r.recipe_id = :r
        ");
        $stmt->execute([':r' => $recipe_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function get_average_rating($recipe_id) {
        $stmt = $this->connection->prepare("
            SELECT AVG(rating) as average_rating 
            FROM ratings 
            WHERE recipe_id = :r
        ");
        $stmt->execute([':r' => $recipe_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['average_rating'] ? round($result['average_rating'], 1) : 0;
    }
}
?>
