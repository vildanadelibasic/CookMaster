<?php
require_once __DIR__ . '/BaseDAO.php';

class UserDao extends BaseDao {
    public function __construct() {
        parent::__construct('users', 'userid');
    }

    public function add_user($name, $email, $password, $role = 'user', $status = 'active') {
        return $this->add([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => $role,
            'status' => $status
        ]);
    }

    public function get_all_users() {
        return $this->get_all();
    }

    public function get_user_by_id($id) {
        $result = $this->get_by_id($id);
        return reset($result);
    }

    public function update_user($id, $name, $email, $password, $role, $status) {
        return $this->update([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => $role,
            'status' => $status
        ], $id);
    }

    public function delete_user($id) {
        return $this->delete($id);
    }

    public function get_user_by_email($email) {
        return $this->query("SELECT * FROM users WHERE email = :email", ['email' => $email]);
    }

    public function get_by_email($email) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE email = :email");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
