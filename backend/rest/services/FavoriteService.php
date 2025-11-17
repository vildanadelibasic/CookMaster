<?php
require_once 'BaseService.php';
require_once(__DIR__ . '/../dao/FavoriteDao.php');

class FavoriteService extends BaseService {

   private $favoriteValidationRules = [
       'user_id' => ['required' => true],
       'recipe_id' => ['required' => true]
   ];

   public function __construct() {
       $dao = new FavoriteDao();
       parent::__construct($dao);
   }

   public function addFavorite($user_id, $recipe_id) {
       $data = ['user_id' => $user_id, 'recipe_id' => $recipe_id];
       $this->validate($data, $this->favoriteValidationRules);

       $existing = $this->dao->get_user_recipe_favorite($user_id, $recipe_id);
       if ($existing) {
           throw new Exception("Recept je već u favoritima!");
       }

       return $this->dao->add_favorite($user_id, $recipe_id);
   }

   public function updateFavorite($id, $user_id, $recipe_id) {
       $data = ['user_id' => $user_id, 'recipe_id' => $recipe_id];
       $this->validate($data, $this->favoriteValidationRules);
       return $this->dao->update_favorite($id, $user_id, $recipe_id);
   }

   public function deleteFavorite($id) {
       return $this->dao->delete_favorite($id);
   }

   public function getUserFavorites($user_id) {
       return $this->dao->get_by_user($user_id);
   }

   public function checkIsFavorite($user_id, $recipe_id) {
       return $this->dao->get_user_recipe_favorite($user_id, $recipe_id) !== null;
   }

   public function getAllFavorites() {
       return $this->dao->get_all_favorites();
   }

   public function getFavoriteById($id) {
       return $this->dao->get_favorite_by_id($id);
   }
}
?>
