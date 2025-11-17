<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/UserDao.php';

class UserService extends BaseService {

   private $userValidationRules = [
       'name' => ['required' => true, 'max' => 100],
       'email' => ['required' => true, 'email' => true, 'max' => 100],
       'password' => ['required' => true, 'min' => 6],
       'role' => ['required' => true, 'max' => 20],
       'status' => ['required' => true, 'max' => 20]
   ];

   public function __construct() {
       $dao = new UserDao();
       parent::__construct($dao);
   }

   public function createUser($name, $email, $password, $role = 'user', $status = 'active') {
       $data = ['name' => $name, 'email' => $email, 'password' => $password, 'role' => $role, 'status' => $status];
       $this->validate($data, $this->userValidationRules);
       $data['password'] = password_hash($password, PASSWORD_DEFAULT);
       $data = $this->sanitize($data);
       return $this->dao->add_user($data['name'], $data['email'], $data['password'], $data['role'], $data['status']);
   }

   public function updateUser($id, $name, $email, $password, $role, $status) {
       $data = ['name' => $name, 'email' => $email, 'password' => $password, 'role' => $role, 'status' => $status];
       $this->validate($data, $this->userValidationRules);
       if (!empty($password)) {
           $password = password_hash($password, PASSWORD_DEFAULT);
       }
       $data = $this->sanitize($data);
       return $this->dao->update_user($id, $data['name'], $data['email'], $data['password'], $data['role'], $data['status']);
   }

   public function deleteUser($id) {
       return $this->dao->delete_user($id);
   }

   public function getUserById($id) {
       return $this->dao->get_user_by_id($id);
   }

   public function getUserByEmail($email) {
       return $this->dao->get_user_by_email($email);
   }

   public function login($email, $password) {
       if (empty($email) || empty($password)) {
           throw new Exception("Email i šifra su obavezni!");
       }
       $user = $this->dao->get_user_by_email($email);
       if (!$user || !password_verify($password, $user['password'])) {
           throw new Exception("Pogrešan email ili šifra!");
       }
       return $user;
   }
}
?>
