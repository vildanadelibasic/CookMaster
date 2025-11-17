<?php
require_once __DIR__ . '/BaseDao.php';

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
        return $this->getAll();
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
}
?>
