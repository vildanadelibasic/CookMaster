<?php
require_once(__DIR__ . '/../dao/BaseDao.php');

class BaseService {
    protected $dao;

    public function __construct($dao) {
        $this->dao = $dao;
    }

    public function getAll() {
        return $this->dao->getAll();
    }

    public function getById($id) {
        return $this->dao->getById($id);
    }

    public function create($data) {
        return $this->dao->insert($data);
    }

    public function update($id, $data) {
        return $this->dao->update($id, $data);
    }

    public function delete($id) {
        return $this->dao->delete($id);
    }

protected function validate($data, $rules) {
    foreach ($rules as $field => $constraints) {
        if (($constraints['required'] ?? false) && !isset($data[$field])) {
            throw new Exception("Field '$field' is required.");
        }
        if (isset($constraints['max']) && isset($data[$field]) && strlen($data[$field]) > $constraints['max']) {
            throw new Exception("Field '$field' exceeds maximum length of {$constraints['max']}.");
        }
    }
}


 protected function sanitize($data) {
        $sanitized = [];
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = htmlspecialchars(strip_tags($value));
            } else {
                $sanitized[$key] = $value;
            }
        }
        return $sanitized;
    }
}
?>
