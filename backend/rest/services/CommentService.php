<?php
require_once 'BaseService.php';
require_once(__DIR__ . '/../dao/CommentDAO.php');
class CommentService extends BaseService {
    private $commentValidationRules = [
        'user_id' => ['required' => true],
        'recipe_id' => ['required' => true],
        'content' => ['required' => true, 'max' => 1000],
        'is_question' => ['required' => true],
        'parent_id' => []
    ];
    public function __construct() {
        parent::__construct(new CommentDao());
    }
    public function addComment($user_id, $recipe_id, $content, $parent_id = null, $is_question = false) {
        $data = [
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'content' => $content,
            'parent_id' => $parent_id,
            'is_question' => $is_question
        ];
        $this->validate($data, $this->commentValidationRules);
        if (!empty($parent_id)) {
            $parent = $this->getById($parent_id);
            if (!$parent) {
                throw new Exception("Comment parent does not exist!");
            }
        }
        $data = $this->sanitize($data);
        return $this->dao->add_comment(
            $data['user_id'], $data['recipe_id'], $data['content'], $data['parent_id'], $data['is_question']
        );
    }
    public function updateComment($id, $user_id, $recipe_id, $content, $parent_id = null, $is_question = false) {
        $data = [
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'content' => $content,
            'parent_id' => $parent_id,
            'is_question' => $is_question
        ];
        $this->validate($data, $this->commentValidationRules);
        $data = $this->sanitize($data);
        return $this->dao->update_comment(
            $id, $data['user_id'], $data['recipe_id'], $data['content'], $data['parent_id'], $data['is_question']
        );
    }
    public function deleteComment($id) {
        return $this->dao->delete_comment($id);
    }
    public function getCommentById($id) {
        return $this->dao->get_comment_by_id($id);
    }
    public function getAllComments() {
        return $this->dao->get_all_comments();
    }
    public function getRecipeComments($recipe_id) {
        return $this->dao->get_by_recipe($recipe_id);
    }
    public function getUserComments($user_id) {
        return $this->dao->get_by_user($user_id);
    }
    public function getCommentsByRecipeId($recipe_id) {
        return $this->dao->get_by_recipe($recipe_id);
    }
}

