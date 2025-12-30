<?php
require_once(__DIR__ . '/../dao/BaseDAO.php');
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
        if (($constraints['required'] ?? false) && (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === ''))) {
            throw new Exception("Field '$field' is required.");
        }
        
        if (!isset($data[$field]) || $data[$field] === '') {
            continue;
        }
        
        $value = $data[$field];
        
        if (isset($constraints['max']) && is_string($value) && strlen($value) > $constraints['max']) {
            throw new Exception("Field '$field' exceeds maximum length of {$constraints['max']}.");
        }
        
        if (isset($constraints['min']) && is_string($value) && strlen($value) < $constraints['min']) {
            throw new Exception("Field '$field' must be at least {$constraints['min']} characters.");
        }
        
        if (isset($constraints['email']) && $constraints['email'] === true) {
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Field '$field' must be a valid email address.");
            }
        }
        
        if (isset($constraints['numeric']) && $constraints['numeric'] === true) {
            if (!is_numeric($value)) {
                throw new Exception("Field '$field' must be a number.");
            }
        }
        
        if (isset($constraints['minValue']) && is_numeric($value)) {
            if ($value < $constraints['minValue']) {
                throw new Exception("Field '$field' must be at least {$constraints['minValue']}.");
            }
        }
        
        if (isset($constraints['maxValue']) && is_numeric($value)) {
            if ($value > $constraints['maxValue']) {
                throw new Exception("Field '$field' must be no more than {$constraints['maxValue']}.");
            }
        }
        
        if (isset($constraints['url']) && $constraints['url'] === true) {
            if (!filter_var($value, FILTER_VALIDATE_URL)) {
                throw new Exception("Field '$field' must be a valid URL.");
            }
        }
        
        if (isset($constraints['in']) && is_array($constraints['in'])) {
            if (!in_array($value, $constraints['in'])) {
                throw new Exception("Field '$field' has an invalid value.");
            }
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
