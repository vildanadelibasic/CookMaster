<?php
require_once __DIR__ . '/BaseDAO.php';
class CommentDao extends BaseDao {
    public function __construct() {
        parent::__construct('comments', 'comment_id');
    }
    public function add_comment($user_id, $recipe_id, $content, $parent_id = null, $is_question = false) {
        return $this->insert([
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'parent_id' => $parent_id,
            'content' => $content,
            'is_question' => $is_question
        ]);
    }
    public function get_all_comments() {
        $stmt = $this->connection->prepare("
            SELECT c.*, u.name as user_name, r.title as recipe_title
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.user_id
            LEFT JOIN recipes r ON c.recipe_id = r.recipe_id
            ORDER BY c.created_at DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function get_comment_by_id($id) {
        return $this->getById($id);
    }
    public function update_comment($id, $user_id, $recipe_id, $content, $parent_id = null, $is_question = false) {
        return $this->update($id, [
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'parent_id' => $parent_id,
            'content' => $content,
            'is_question' => $is_question
        ]);
    }
    public function delete_comment($id) {
        return $this->delete($id);
    }
    public function get_by_recipe($recipe_id) {
        $stmt = $this->connection->prepare("
            SELECT c.*, u.name as user_name 
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.user_id
            WHERE c.recipe_id = :r
            ORDER BY c.comment_id DESC
        ");
        $stmt->execute([':r' => $recipe_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function get_by_user($user_id) {
        $stmt = $this->connection->prepare("
            SELECT c.*, r.title as recipe_title 
            FROM comments c
            LEFT JOIN recipes r ON c.recipe_id = r.recipe_id
            WHERE c.user_id = :u
            ORDER BY c.comment_id DESC
        ");
        $stmt->execute([':u' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

