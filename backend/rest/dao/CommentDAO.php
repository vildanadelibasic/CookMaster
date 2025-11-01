<?php
require_once __DIR__ . '/BaseDAO.php';

class CommentDao extends BaseDao {
    public function __construct() {
        parent::__construct('comments', 'comment_id');
    }

    public function add_comment($user_id, $recipe_id, $content, $parent_id = null, $is_question = false) {
        return $this->add([
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'parent_id' => $parent_id,
            'content' => $content,
            'is_question' => $is_question
        ]);
    }

    public function get_all_comments() {
        return $this->get_all();
    }

    public function get_comment_by_id($id) {
        $result = $this->get_by_id($id);
        return reset($result);
    }

    public function update_comment($id, $user_id, $recipe_id, $content, $parent_id = null, $is_question = false) {
        return $this->update([
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'content' => $content,
            'parent_id' => $parent_id,
            'is_question' => $is_question
        ], $id);
    }

    public function delete_comment($id) {
        return $this->delete($id);
    }
}
?>
