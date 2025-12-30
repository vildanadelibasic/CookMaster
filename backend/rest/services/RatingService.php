<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/RatingDAO.php';
class RatingService extends BaseService {
    public function __construct() {
        parent::__construct(new RatingDao());
    }
    public function addRating($user_id, $recipe_id, $rating) {
        if ($rating < 1 || $rating > 5) {
            throw new Exception("Ocjena mora biti između 1 i 5!");
        }
        $existing = $this->dao->get_user_recipe_rating($user_id, $recipe_id);
        if ($existing) {
            throw new Exception("Korisnik je već ocijenio ovaj recept!");
        }
        return $this->dao->add_rating($user_id, $recipe_id, $rating);
    }
    public function updateRating($id, $user_id, $recipe_id, $rating) {
        if ($rating < 1 || $rating > 5) {
            throw new Exception("Ocjena mora biti između 1 i 5!");
        }
        return $this->dao->update_rating($id, $user_id, $recipe_id, $rating);
    }
    public function deleteRating($id) {
        return $this->dao->delete_rating($id);
    }
    public function getAllRatings() {
        return $this->dao->get_all_ratings();
    }
    public function getRatingById($id) {
        return $this->dao->get_rating_by_id($id);
    }
    public function getUserRatings($user_id) {
        return $this->dao->get_by_user($user_id);
    }
    public function checkUserRated($user_id, $recipe_id) {
        return $this->dao->get_user_recipe_rating($user_id, $recipe_id) !== null;
    }
    public function getRatingsByRecipeId($recipe_id) {
        return $this->dao->get_by_recipe($recipe_id);
    }
    public function getAverageRating($recipe_id) {
        return $this->dao->get_average_rating($recipe_id);
    }
}

