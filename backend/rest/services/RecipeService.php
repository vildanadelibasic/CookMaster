<?php
require_once(__DIR__ . '/BaseService.php');
require_once(__DIR__ . '/../dao/RecipeDao.php');

class RecipeService extends BaseService {

    private $recipeValidationRules = [
        'title' => ['required' => true, 'max' => 255],
        'instructions' => ['required' => true],
        'user_id' => ['required' => true],
        'category_id' => ['required' => true],
        'prep_time' => ['required' => true],          
        'difficulty' => ['required' => true, 'max' => 50]  
    ];

    public function __construct() {
        $dao = new RecipeDao();
        parent::__construct($dao);
    }

    public function createRecipe($data) {
        $this->validate($data, $this->recipeValidationRules);
        $data = $this->sanitize($data);
        return $this->dao->add_recipe($data);
    }

    public function updateRecipe($id, $data) {
        $this->validate($data, $this->recipeValidationRules);
        $data = $this->sanitize($data);
        return $this->dao->update_recipe($id, $data);
    }

    public function deleteRecipe($id) {
        return $this->dao->delete_recipe($id);
    }

    public function getRecipeById($id) {
        return $this->dao->get_recipe_by_id($id);
    }

    public function getAllRecipes() {
        return $this->dao->get_all_recipes();
    }

    public function getRecipesByCategory($category_id) {
        return $this->dao->get_by_category($category_id);
    }

    public function searchRecipes($query) {
        return $this->dao->search($query);
    }

    public function getPopularRecipes($limit = 10) {
        return $this->dao->get_popular($limit);
    }
}
?>
