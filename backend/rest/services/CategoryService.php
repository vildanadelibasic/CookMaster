<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/CategoryDao.php';

class CategoryService extends BaseService {

    private $categoryValidationRules = [
        'name' => ['required' => true, 'max' => 100],
        'description' => ['max' => 500]
    ];

    public function __construct() {
        parent::__construct(new CategoryDao());
    }

    public function addCategory($data) {
        $this->validate($data, $this->categoryValidationRules);
        $data = $this->sanitize($data);
        return parent::create($data);
    }

    public function updateCategory($id, $data) {
        $this->validate($data, $this->categoryValidationRules);
        $data = $this->sanitize($data);
        return parent::update($id, $data);
    }

    public function deleteCategory($id) {
        return parent::delete($id);
    }

    public function getCategoriesWithRecipes() {
        return $this->dao->get_categories_with_recipes();
    }
}
?>
