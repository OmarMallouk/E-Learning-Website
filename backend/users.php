<?php

class User {
    private $name;
    private $email;
    private $password;
    private $role;
    private $conn;

    public function __construct($name, $email, $password, $role, $conn) {
        $this->name = $name;
        $this->email = $email;
        $this->password = password_hash($password, PASSWORD_BCRYPT);
        $this->role = $role;
        $this->conn = $conn;
    }

    public static function check_password($password) {
        $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{12,}$/';
        return preg_match($pattern, $password) ? true : false;
    }

    public static function validate_email($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) ? true : false;
    }

    public function save() {
        $sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssss", $this->name, $this->email, $this->password, $this->role);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
    
    public function displayInfo() {
        return json_encode(["name" => $this->name, "email" => $this->email, "role" => $this->role]);
    }
}



?>