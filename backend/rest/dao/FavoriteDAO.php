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
        return $this->getAll();
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
        $stmt = $this->conn->prepare("
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
        $stmt = $this->conn->prepare("
            SELECT * FROM favorites WHERE user_id = :u
        ");
        $stmt->execute([':u' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
