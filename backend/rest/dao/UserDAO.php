<?php
require_once __DIR__ . '/BaseDao.php';
class UserDao extends BaseDao {
    public function __construct() {
        parent::__construct('users', 'user_id');
    }
    public function add_user($name, $email, $password, $role = 'user', $status = 'active') {
        return $this->insert([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => $role,
            'status' => $status
        ]);
    }
    public function get_all_users() {
        return $this->getAll();
    }
    public function get_user_by_id($id) {
        return $this->getById($id);
    }
    public function update_user($id, $name, $email, $password, $role, $status) {
        return $this->update($id, [
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => $role,
            'status' => $status
        ]);
    }
    public function delete_user($id) {
        return $this->delete($id);
    }
    public function get_user_by_email($email) {
        $stmt = $this->connection->prepare("SELECT * FROM " . $this->table . " WHERE email = :email");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
